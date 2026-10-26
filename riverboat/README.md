# Breakfast on a Little River Boat

A 30-second vertical (9:16, 1080×1920) anime slice-of-life short for YouTube Shorts, Reels and TikTok. It has no text or narration: natural synced sound (shutters, river, market, egg cracking, sizzling, tea pouring) with a peaceful guitar, piano, marimba and flute bed.

| # | Time | Shot |
|---|---|---|
| 1 | 0–4s | The traveler opens the shutters onto the misty river at sunrise |
| 2 | 4–8s | Buying herbs from a vendor's boat at the floating market |
| 3 | 8–12s | Cracking an egg; herbs, tomato, chili and rice on the board |
| 4 | 12–16s | Eggs and greens frying; the rice pot steaming |
| 5 | 16–20s | Pouring hot tea from a clay teapot |
| 6 | 20–24s | The first bite of breakfast by the open window |
| 7 | 24–30s | Outside view: the houseboat glides past the wooden bridge and lotus flowers |

**Output:** `out/breakfast-river-boat-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

Shot 1 is the character and boat anchor. Each shot's `refs` in `story.json` lists the frames it is painted against.
