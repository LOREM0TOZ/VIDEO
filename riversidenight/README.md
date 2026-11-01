# A Magical Night by the Riverside

A 30-second vertical (9:16, 1080×1920) anime short about three friends around a campfire under a giant tree beside a moonlit river on a summer night. Five slow shots are joined by 1-second dissolves at 6, 12, 18 and 24 seconds, under an original slow acoustic guitar, piano and pad score (about 60 bpm) with river, crickets, fire and soft guitar ambience. There is no voice and no text.

Characters, always seated in this order from left to right (held consistent by anchoring on shot 1):

- **Friend 1:** messy black hair, olive-green T-shirt
- **Friend 3:** a young woman with a short black bob and a mustard cardigan
- **Friend 2:** brown ponytail, open denim shirt; plays the guitar

| Time | Shot |
|---|---|
| 0–6s | Wide: the riverside camp beneath the huge tree, under a full moon |
| 6–12s | Close around the fire: wood added, a warm cup, easy smiles |
| 12–18s | Friend 2 plays the acoustic guitar as fireflies drift |
| 18–24s | Low by the campfire, sparks rising; sharing chestnuts and marshmallows |
| 24–30s | Very wide from across the river, pulling back from the tiny glowing camp |

**Output:** `out/magical-night-riverside-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

The reference prompt asks for a new camera angle on every shot, because the model otherwise copies the anchor's composition. Shot 3's `audio_gain` tames the loud generated guitar.
