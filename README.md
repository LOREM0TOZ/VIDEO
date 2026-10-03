# Foundryy brand promo

A 22-second 1920×1080 promo video for [foundryy.tech](https://www.foundryy.tech/). Everything in it is drawn with code: an HTML/Canvas scene rendered frame by frame in headless Chromium, then encoded with ffmpeg. The soundtrack is synthesized in code as well.

**Output:** `out/foundryy-promo.mp4`

## Storyboard

| Time | Scene |
|---|---|
| 0–3.3s | Opener line rises in over a molten line drawn across the frame |
| 3.4–6.9s | "Ideas. Code. Ambition." hammered in; each word gets an anvil strike, a spark burst and camera shake |
| 7–10.6s | Forge line fills with a molten gradient |
| 10.7–14.9s | Three pillar cards (Design / Build / Launch) assemble over a blueprint grid |
| 15–22s | Big spark burst, then the logo mark draws on, wordmark, tagline, CTA and URL |

## Edit the copy

All text and colors live in `brand.config.json`. The copy in it is **placeholder**: foundryy.tech couldn't be reached from the render environment. Swap in the site's real tagline, features and brand colors, then re-render.

## Render

```bash
npm install
npm run render          # → out/foundryy-promo.mp4 (about 6 min)
npm run render:stills   # quick PNG previews at key moments
```

Requires ffmpeg on PATH. Set `CHROMIUM_PATH` if Playwright can't find a browser.
