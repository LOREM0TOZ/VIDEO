"""Generates the Mud Crab Curry shots on Vertex AI.

  python3 -I gen.py frames   # one painted keyframe per shot (Gemini image model)
  python3 -I gen.py clips    # animate each keyframe into a clip with sound (Veo)
  python3 -I gen.py music    # acoustic underscore (Lyria)
  add --only 3 to limit to one shot

Needs GCP_SA_KEY_B64 and GCP_PROJECT_ID in the environment. Outputs go to build/.
"""
import base64, json, os, ssl, subprocess, sys, time, urllib.request, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(HERE, "build")
PROJECT = os.environ["GCP_PROJECT_ID"]
REGION = "us-central1"
IMAGE_MODEL = "gemini-3.1-flash-image"
VIDEO_MODEL = "veo-3.1-fast-generate-001"
MUSIC_MODEL = "lyria-002"
CA = "/root/.ccr/ca-bundle.crt"
CTX = ssl.create_default_context(cafile=CA if os.path.exists(CA) else None)
STORY = json.load(open(os.path.join(HERE, "story.json")))
_tok = {"v": None, "t": 0}


def token():
    if _tok["v"] and time.time() - _tok["t"] < 3000:
        return _tok["v"]
    key = json.loads(base64.b64decode(os.environ["GCP_SA_KEY_B64"]))
    b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=")
    now = int(time.time())
    head = b64(json.dumps({"alg": "RS256", "typ": "JWT"}).encode())
    claim = b64(json.dumps({"iss": key["client_email"], "scope": "https://www.googleapis.com/auth/cloud-platform",
                            "aud": "https://oauth2.googleapis.com/token", "iat": now, "exp": now + 3600}).encode())
    with tempfile.NamedTemporaryFile("w", delete=True) as f:
        f.write(key["private_key"]); f.flush()
        sig = subprocess.run(["openssl", "dgst", "-sha256", "-sign", f.name], input=head + b"." + claim,
                             capture_output=True, check=True).stdout
    jwt = (head + b"." + claim + b"." + b64(sig)).decode()
    body = f"grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion={jwt}".encode()
    r = urllib.request.urlopen(urllib.request.Request("https://oauth2.googleapis.com/token", body), context=CTX)
    _tok.update(v=json.load(r)["access_token"], t=time.time())
    return _tok["v"]


class Busy(Exception):
    pass


def call(url, payload=None):
    req = urllib.request.Request(url, json.dumps(payload).encode() if payload is not None else None,
                                 {"Authorization": f"Bearer {token()}", "Content-Type": "application/json"})
    try:
        return json.load(urllib.request.urlopen(req, context=CTX, timeout=600))
    except urllib.error.HTTPError as e:
        if e.code == 429:
            raise Busy()
        sys.exit(f"HTTP {e.code} from {url}\n{e.read().decode()[:2000]}")


def base(model, host=f"{REGION}-aiplatform.googleapis.com", loc=REGION):
    return f"https://{host}/v1/projects/{PROJECT}/locations/{loc}/publishers/google/models/{model}"


def shots():
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    return [s for s in STORY["shots"] if only is None or str(s["id"]) == only]


def frames():
    for s in shots():
        out = os.path.join(BUILD, f"frame-{s['id']}.png")
        if os.path.exists(out):
            print("skip", out); continue
        prompt = f"{STORY['style']}\n\nScene: {s['frame']}\n\nWidescreen 16:9 composition."
        # gemini image models are served from the global endpoint
        r = call(base(IMAGE_MODEL, "aiplatform.googleapis.com", "global") + ":generateContent", {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}}})
        parts = r["candidates"][0]["content"]["parts"]
        img = next(p["inlineData"]["data"] for p in parts if "inlineData" in p)
        open(out, "wb").write(base64.b64decode(img))
        print("wrote", out, r.get("usageMetadata", {}))


def clips():
    # job ids are saved as soon as they are issued, so a crash never orphans a paid generation
    ops_path = os.path.join(BUILD, "ops.json")
    ops = {int(k): v for k, v in (json.load(open(ops_path)).items() if os.path.exists(ops_path) else [])}
    save = lambda: json.dump(ops, open(ops_path, "w"))
    todo = [s for s in shots() if not os.path.exists(os.path.join(BUILD, f"clip-{s['id']}.mp4")) and s["id"] not in ops]
    while todo or ops:
        while todo:
            s = todo[0]
            img = base64.b64encode(open(os.path.join(BUILD, f"frame-{s['id']}.png"), "rb").read()).decode()
            prompt = f"{STORY['motion_style']} {s['motion']} Sound: {s['sound']}."
            try:
                r = call(base(VIDEO_MODEL) + ":predictLongRunning", {
                    "instances": [{"prompt": prompt, "image": {"bytesBase64Encoded": img, "mimeType": "image/png"}}],
                    "parameters": {"aspectRatio": "16:9", "durationSeconds": STORY["seconds_per_shot"], "sampleCount": 1,
                                   "generateAudio": True, "resolution": "1080p",
                                   "negativePrompt": "text, subtitles, watermark, music, speech, photorealistic, 3D render"}})
            except Busy:
                print("quota busy, waiting for a running job to finish"); break
            ops[s["id"]] = r["name"]; save(); todo.pop(0); print("started shot", s["id"])
        time.sleep(15)
        for sid, name in list(ops.items()):
            try:
                r = call(base(VIDEO_MODEL) + ":fetchPredictOperation", {"operationName": name})
            except Busy:
                continue
            if not r.get("done"):
                continue
            del ops[sid]; save()
            if "error" in r:
                print("shot", sid, "failed:", r["error"]); continue
            vids = r["response"].get("videos", [])
            if not vids:
                print("shot", sid, "returned no video (filtered?):", json.dumps(r["response"])[:500]); continue
            out = os.path.join(BUILD, f"clip-{sid}.mp4")
            open(out, "wb").write(base64.b64decode(vids[0]["bytesBase64Encoded"]))
            print("wrote", out)


def music():
    out = os.path.join(BUILD, "music.wav")
    if os.path.exists(out):
        print("skip", out); return
    r = call(base(MUSIC_MODEL) + ":predict", {"instances": [{
        "prompt": "Gentle warm acoustic guitar with soft fingerpicking, light hand percussion and a little kalimba, "
                  "calm, cozy, sunrise by a river, slow tempo, peaceful cooking video underscore",
        "negative_prompt": "vocals, drums, electric guitar, aggressive"}], "parameters": {"sample_count": 1}})
    open(out, "wb").write(base64.b64decode(r["predictions"][0]["bytesBase64Encoded"]))
    print("wrote", out)


if __name__ == "__main__":
    os.makedirs(BUILD, exist_ok=True)
    {"frames": frames, "clips": clips, "music": music}[sys.argv[1]]()
