# A Rainy Night in the Forest Cabin

A 30-second vertical (9:16, 1080×1920) cozy anime cooking short for YouTube Shorts, Reels and TikTok. It has no text or narration: natural synced sound (rain, door, chopping, fire, bubbling broth, a bowl set down) with a peaceful piano, cello and music-box bed.

| # | Time | Shot |
|---|---|---|
| 1 | 0–4s | The traveler walks the misty, rainy trail toward the glowing cabin |
| 2 | 4–8s | The cabin door opens; warm light spills over the wet steps |
| 3 | 8–12s | Slicing mushrooms; green onion, garlic and noodles on the table |
| 4 | 12–16s | Firewood goes into the iron stove; the flames catch |
| 5 | 16–20s | Noodles, mushrooms and greens stirred in the simmering pot |
| 6 | 20–24s | The steaming ramen bowl is set by the rain-covered window |
| 7 | 24–30s | The traveler, from behind, lifts the bowl; the stove glows, rain outside |

**Output:** `out/rainy-night-forest-cabin-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

Each shot's `refs` in `story.json` lists the keyframes it is painted against. Shot 1 (outdoors) and shot 3 (the cabin interior) are the anchors that keep the traveler and the room consistent.
