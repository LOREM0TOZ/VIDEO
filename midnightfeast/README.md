# A Midnight Feast with Old Friends

A 30-second vertical (9:16, 1080×1920) cozy anime short about three friends making pan-fried dumplings over a wood fire outside a countryside cottage on a starry night. It has an original guitar, piano and flute track (about 72 bpm) with synced fire, sizzle and soft laughter sounds. There is no dialogue and no text.

Characters (held consistent by anchoring every frame on shot 1):

- **Friend 1:** brown shirt, spiky black hair
- **Friend 2:** beige shirt, wavy chestnut hair
- **Friend 3:** blue shirt, round glasses

| Time | Shot |
|---|---|
| 0–5s | Wide: Friend 1 lights the stove, Friend 2 sets out ingredients, Friend 3 arrives with tea |
| 5–11s | Overhead: rolling wrappers, adding filling and pleating dumplings together |
| 11–16s | At the brick stove: wood into the fire, oil into the iron pan, a plate of dumplings ready |
| 16–24s | The pan: golden dumplings, a puff of steam, the lid comes off and the friends light up |
| 24–30s | Sharing the feast and pouring tea, then pulling back to the cottage under the stars |

**Output:** `out/midnight-feast-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

Shot 4's prompts insist on exactly three people, because a first take grew a duplicate fourth friend out of the steam.
