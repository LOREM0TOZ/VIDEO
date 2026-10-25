// Renders transparent title-card PNGs (1920x1080) for the edit.
import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const story = JSON.parse(readFileSync(resolve(here, "story.json"), "utf8"));
const font = (f) => pathToFileURL(resolve(here, "../node_modules/@fontsource/fraunces/files", f)).href;
const css = `
@font-face{font-family:F;font-weight:600;src:url(${font("fraunces-latin-600-normal.woff2")})}
@font-face{font-family:F;font-style:italic;font-weight:400;src:url(${font("fraunces-latin-400-italic.woff2")})}
html,body{margin:0;width:1920px;height:1080px;background:transparent}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:120px;
  background:linear-gradient(transparent 55%,rgba(20,10,0,.55));color:#fff8ec;text-shadow:0 3px 18px rgba(0,0,0,.55)}
h1{font:600 84px F;margin:0;letter-spacing:-.01em}
p{font:italic 400 40px F;margin:8px 0 0;opacity:.95}`;
const cards = {
  "title-open.png": `<h1>${story.title}</h1>`,
  "title-end.png": `<h1>${story.title}</h1><p>${story.subtitle}</p>`,
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (const [file, html] of Object.entries(cards)) {
  // load from a file:// page so the local font files are allowed
  const tmp = resolve(here, "build", "title.html");
  writeFileSync(tmp, `<!doctype html><meta charset="utf-8"><style>${css}</style><div class="wrap">${html}</div>`);
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(async () => { await document.fonts.ready; if (![...document.fonts].some(f => f.status === "loaded")) throw new Error("title font failed to load"); });
  await page.screenshot({ path: resolve(here, "build", file), omitBackground: true });
  console.log("wrote", file);
}
await browser.close();
