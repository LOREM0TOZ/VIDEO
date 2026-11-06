# Village Robot Battle

A 30-second vertical (9:16, 1080×1920) stylized 3D cartoon short: two miniature battle robots fight in a small arena in a countryside village square while villagers cheer. Six shots with quick 0.25-second blends land on the brief's timings (5, 10, 16, 22 and 26 seconds), under an original playful orchestral and synth score that builds through the battle and turns triumphant at the end, with motor, impact, spark and crowd sounds. There is no voice and no text.

Robots (held consistent by anchoring on shot 1):

- **Green Crusher:** a low, wide black and green bot with a big front spinning disc and green lights. It wins.
- **Red Thunder:** an angular red and black wedge with a silver front flipper and red lights.

| Time | Shot |
|---|---|
| 0–5s | Flying down over the village to the arena, the robots waiting on opposite sides |
| 5–10s | Floor-level close-ups as they roll in, disc spinning up, then pushing nose to nose |
| 10–16s | The first collision in a shower of sparks; they bounce apart |
| 16–22s | Red Thunder's flipper pops Green Crusher into the air; it lands and fights on |
| 22–26s | The final head-on clash in a burst of sparks |
| 26–30s | Green Crusher's victory lap as the villagers celebrate; pulling back over the village |

**Output:** `out/village-robot-battle-9x16.mp4`

## Rebuild

```bash
python3 -I gen.py frames && python3 -I gen.py clips && python3 -I gen.py music && ./assemble.sh
```

The motion prompt pins the robots to their wheels, because first takes turned them into walking humanoids, a flying robot and an explosion.
