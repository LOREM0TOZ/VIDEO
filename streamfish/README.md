# Forest Stream Fish Soup

A 30-second vertical (9:16, 1080×1920) anime-style wilderness cooking short for YouTube Shorts, TikTok and Reels. It has no text or narration: just natural synced sound with a peaceful piano-and-guitar music bed.

| # | Time | Shot |
|---|---|---|
| 1 | 0–4s | A trout glides over river stones in the clear stream |
| 2 | 4–8s | A hand lifts the fish from the water, droplets falling |
| 3 | 8–12s | Slicing shiitake on the wooden board by the stream |
| 4 | 12–16s | A small campfire in a stone ring, embers and smoke |
| 5 | 16–20s | The fish grilling golden on a metal grate |
| 6 | 20–24s | Mushrooms and greens go into the black pot of broth |
| 7 | 24–30s | The finished fish soup, steaming, the stream behind |

**Output:** `out/forest-stream-fish-soup-9x16.mp4`

## Rebuild

This uses the same pipeline as `../mudcrab` (see the README there):

```bash
python3 -I gen.py frames
python3 -I gen.py clips
python3 -I gen.py music
./assemble.sh
```

Shot 1 is the anchor frame. Every later keyframe is painted with shot 1 as a reference image, so the stream, the palette and the camper's sleeve stay consistent.
