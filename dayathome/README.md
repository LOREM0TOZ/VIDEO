# A Peaceful Day at Home

A 30-second vertical (9:16, 1080×1920) anime slice-of-life short about a young woman (yellow T-shirt, white shorts, long dark brown ponytail) and her orange tabby cat spending a quiet day in a wooden countryside house. Six shots are joined by 1-second dissolves at the brief's scene breaks (5, 10, 16, 20 and 25 seconds), under an original felt-piano, guitar, music-box, pad and flute score (about 60 bpm) with soft everyday sounds. There is no voice and no text.

| Time | Shot |
|---|---|
| 0–5s | Brushing her teeth in the sunny wooden bathroom, the cat on the bath mat |
| 5–10s | Hanging washing on the line in the backyard garden |
| 10–16s | Stir-frying vegetables in the kitchen, steam rising |
| 16–20s | Rinsing a plate at the window sink and shelving it |
| 20–25s | On the sofa as the cat hops up and curls beside her |
| 25–30s | Reading and stroking the sleeping cat in a ray of sun |

**Output:** `out/peaceful-day-at-home-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

Shot `seconds` values are fractional (5.5, 7 and so on), so the 1-second dissolves land on the brief's timings.
