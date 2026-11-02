# Three Friends Baking Together

A 30-second vertical (9:16, 1080×1920) anime slice-of-life short about three friends baking a strawberry Swiss roll in a sunny countryside kitchen. Six shots are joined by 1-second dissolves at the brief's scene breaks (5, 10, 15, 21 and 26 seconds), under an original felt-piano, guitar, pad and music-box score (about 60 bpm) with soft baking sounds. There is no voice and no text.

Characters (held consistent by anchoring on shot 1):

- **Friend 1:** shoulder-length dark brown hair, cream apron; mixes
- **Friend 2:** short black hair, light blue shirt, brown apron; handles the oven
- **Friend 3:** long black hair tied loosely, pink apron; strawberries and cream

| Time | Shot |
|---|---|
| 0–5s | The whole kitchen: cracking eggs, setting out flour and milk, rinsing strawberries |
| 5–10s | Batter whisked and poured onto the rectangular tray |
| 10–15s | The flat sponge goes into the oven; cream and strawberries prepared behind |
| 15–21s | Overhead: cream spread, strawberries lined up, the sponge rolled up |
| 21–26s | Slicing the roll to show the cream and strawberry spiral, plated with strawberries |
| 26–30s | Tea and cake together at the window table |

**Output:** `out/three-friends-baking-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

`gen.py` skips a shot when the image API returns an empty answer; rerun the command to retry it.
