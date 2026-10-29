# Golden Sunset Village

A 30-second vertical (9:16, 1080×1920) anime countryside scenery film for YouTube Shorts, Reels and TikTok. It has six slow camera moves joined by soft 1.2-second dissolves, an original piano, koto-style strings and flute score that fades in and resolves, and gentle wind, bird and water ambience underneath. There is no voice and no text.

| Time | View |
|---|---|
| 0–6s | Elevated wide view of the valley village, gently moving forward |
| 5–11s | Gliding low over the path between farmhouses, gardens and a persimmon tree |
| 10–16s | The stream, a wooden bridge, wildflowers and floating motes of light |
| 14–20s | The sun sinking between the mountains, rays fanning out |
| 19–25s | Flooded rice terraces mirroring the sunset sky |
| 24–30s | Final wide view of the whole village, easing back and holding |

**Output:** `out/golden-sunset-village-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

This folder's `assemble.sh` uses cross-dissolves (`crossfade` in `story.json`) instead of hard cuts. The style prompt rules out signatures and handwriting, because the image model added fake artist signatures to two frames on the first pass.
