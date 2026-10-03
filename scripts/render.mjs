// Renders src/promo.html frame-by-frame in headless Chromium and encodes an MP4 with ffmpeg.
// Usage: node scripts/render.mjs [--fps 30] [--out out/foundryy-promo.mp4] [--still 16.5]
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeSoundtrack } from "./soundtrack.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const fps = +arg("--fps", 30);
const out = resolve(root, arg("--out", "out/foundryy-promo.mp4"));
const still = arg("--still");
mkdirSync(dirname(out), { recursive: true });

const brand = JSON.parse(readFileSync(resolve(root, "brand.config.json"), "utf8"));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--allow-file-access-from-files", "--force-color-profile=srgb"],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve(root, "src/promo.html")).href);
await page.evaluate(async (b) => { await document.fonts.ready; await Promise.all([...document.fonts].map(f => f.load())); window.PROMO.applyBrand(b); }, brand);
const { DURATION, HITS } = await page.evaluate(() => ({ DURATION: window.PROMO.DURATION, HITS: window.PROMO.HITS }));

if (still) {
  const times = still.split(",").map(Number);
  for (const t of times) {
    await page.evaluate((t) => window.PROMO.renderFrame(t), t);
    const p = resolve(root, `out/still-${t.toFixed(2)}.png`);
    await page.screenshot({ path: p });
    console.log("wrote", p);
  }
  await browser.close();
  process.exit(0);
}

const wav = resolve(root, "out/soundtrack.wav");
writeSoundtrack(wav, { duration: DURATION, hits: HITS });

const ff = spawn("ffmpeg", ["-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
  "-i", wav,
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
  "-c:a", "aac", "-b:a", "192k", "-shortest", out], { stdio: ["pipe", "inherit", "inherit"] });

const total = Math.round(DURATION * fps);
for (let f = 0; f < total; f++) {
  await page.evaluate((t) => window.PROMO.renderFrame(t), f / fps);
  const png = await page.screenshot({ type: "png" });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once("drain", r));
  if (f % fps === 0) process.stdout.write(`\rframe ${f}/${total}`);
}
ff.stdin.end();
await new Promise((r, j) => ff.on("close", c => c === 0 ? r() : j(new Error("ffmpeg exited " + c))));
await browser.close();
console.log(`\nwrote ${out}`);
