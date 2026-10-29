# Countryside Garden Lunch

A 30-second vertical (9:16, 1080×1920) first-person anime cooking short in the Japanese countryside, for YouTube Shorts, Reels and TikTok. It has an original soft lo-fi acoustic track (guitar, piano and pads, about 70 bpm) running throughout, with synced ASMR cooking and nature sounds. There is no voice and no text.

| Time | Shot |
|---|---|
| 0–5s | Picking a ripe tomato into the basket of greens |
| 5–11s | Slicing a tomato next to green onions and washed greens |
| 11–15s | Seasoning the whole fish with salt, pepper, oil and herbs |
| 15–23s | Turning the fish over glowing charcoal until golden |
| 23–26s | Setting the plate: fish, tomato, greens, lemon, rice |
| 26–30s | Slow push-in on the finished lunch, holding at the end |

**Output:** `out/countryside-garden-lunch-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

Veo makes clips of 4, 6 or 8 seconds. A shot's `gen_seconds` sets the generated length and `seconds` sets how much of it is used, so the cut lands on the brief's timings.
