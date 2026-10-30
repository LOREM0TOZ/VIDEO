# A Little Bakery in the Mountains

A 30-second vertical (9:16, 1080×1920) first-person anime baking short for YouTube Shorts, Reels and TikTok. It has an original soft piano, acoustic guitar and music-box track (about 70 bpm) with synced ASMR baking sounds. There is no voice and no text.

| Time | Shot |
|---|---|
| 0–5s | Opening the wooden shutters onto green mountains; morning light fills the kitchen |
| 5–10s | Stirring sliced strawberries and sugar into glossy jam in a copper pan |
| 10–16s | Kneading soft dough on the floured counter, flour drifting in the sunbeam |
| 16–23s | The glowing brick oven: a tray of golden croissants and strawberry pastries comes out in a cloud of steam |
| 23–26s | Setting the croissants on a ceramic plate with jam and coffee |
| 26–30s | Holding on the finished breakfast by the sunny window |

**Output:** `out/little-bakery-mountains-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

A shot's `gen_seconds` sets the generated clip length (4, 6 or 8) and `seconds` sets how much of it is used.
