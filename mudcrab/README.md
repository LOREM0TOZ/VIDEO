# Mud Crab Curry: from the river to the pot

A 20-second "catch and cook" short in a hand-drawn anime style. It has 5 shots of 4 seconds each, with natural sound on every action, an acoustic music bed, and title cards at the start and end.

| # | Shot |
|---|---|
| 1 | The catch: a bamboo trap lifted from the mangrove river, the mud crab inside |
| 2 | One chop splits a green coconut; the water splashes out |
| 3 | Hands squeeze grated coconut; the milk streams into a wooden bowl |
| 4 | Chili paste and coconut milk go into the clay pot over a wood fire |
| 5 | Sunset by the river: curry on a banana leaf, a claw cracked open |

**Outputs**
- `out/mud-crab-curry-16x9.mp4` (1920×1080)
- `out/mud-crab-curry-4x5.mp4` (1080×1350, for Instagram)

## Pipeline

1. `story.json` holds the shot list, the shared style prompt, and the motion and sound prompts for each shot.
2. `python3 -I gen.py frames` paints one keyframe per shot with `gemini-3.1-flash-image` → `build/frame-N.png`.
3. `python3 -I gen.py clips` animates each keyframe with `veo-3.1-fast-generate-001`, including generated sound. Job IDs are saved to `build/ops.json`, so an interrupted run can resume without paying twice.
4. `python3 -I gen.py music` generates the acoustic underscore with `lyria-002`.
5. `node titles.mjs` renders the title cards, then `./assemble.sh` cuts, mixes and exports both aspect ratios.

Add `--only N` to the `gen.py` commands to regenerate a single shot: delete its `build/clip-N.mp4` or `frame-N.png` first. The scripts need `GCP_SA_KEY_B64` and `GCP_PROJECT_ID` in the environment.
