# A Peaceful Night Under the Moonlight

A 30-second vertical (9:16, 1080×1920) anime nighttime ambience film: a young traveler in navy pajamas in a wooden mountain bedroom under a full moon. Five slow shots are joined by 1-second dissolves, with an original felt-piano, pad and music-box score (about 60 bpm, fading in and out) over soft wind, crickets, an owl and the sounds of tea and turning pages. There is no voice and no text.

| Time | Shot |
|---|---|
| 0–6s | Wide: sitting on the bed gazing at the full moon over the valley |
| 6–11s | Curtains billowing toward the open window, fireflies in the trees |
| 11–16s | Pouring warm tea in lantern light, then holding the cup |
| 16–23s | Reading against the pillows, a page turning |
| 23–30s | Asleep under the navy blanket, drifting out to the moonlit landscape |

**Output:** `out/peaceful-night-moonlight-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

`seconds` and `crossfade` in `story.json` are set so the dissolves land on the brief's scene timings.
