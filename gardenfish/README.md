# Garden Grilled Fish

A 28-second vertical (9:16, 1080×1920) first-person anime cooking short set in a Japanese countryside garden, for YouTube Shorts, TikTok and Reels. Per the brief, it uses natural ASMR-style sound only: no music, no voice and no text.

| # | Time | Shot |
|---|---|---|
| 1 | 0–4s | Picking a ripe tomato from the vine |
| 2 | 4–8s | Tapping and lifting a striped watermelon |
| 3 | 8–12s | Slicing green onions; washed greens in a wooden tub |
| 4 | 12–16s | Salting the whole fish on the chopping board |
| 5 | 16–20s | Turning the fish on the charcoal grill with chopsticks |
| 6 | 20–24s | Setting the golden fish on a white plate with lemon |
| 7 | 24–28s | Still-life push-in on the finished meal, steam rising |

**Output:** `out/garden-grilled-fish-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && ./assemble.sh
```

`assemble.sh` mixes in a music bed only if `build/music.wav` exists. To add one, run `python3 -I gen.py music` after adding `music_prompt` and `music_negative` to `story.json`.
