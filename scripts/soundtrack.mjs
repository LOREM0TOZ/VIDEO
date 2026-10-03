// Synthesizes a short score as a 16-bit stereo WAV: a low furnace drone,
// a rising pulse, metallic "anvil" strikes on each hammer hit, and a swell into the logo.
import { writeFileSync } from "node:fs";

export function writeSoundtrack(path, { duration, hits }) {
  const sr = 48000, n = Math.ceil(duration * sr);
  const L = new Float32Array(n), R = new Float32Array(n);
  let seed = 1;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const env = Math.min(1, t / 1.5) * Math.min(1, (duration - t) / 1.2);
    // drone: A1 + E2 with slow beating
    let d = .16 * Math.sin(2 * Math.PI * 55 * t) + .08 * Math.sin(2 * Math.PI * 82.6 * t + Math.sin(t * .7))
          + .05 * Math.sin(2 * Math.PI * 110.3 * t);
    // pulse (kick-like thump every 0.5s) during the build, scenes 3-4
    const beat = .5, bt = t % beat, inBuild = t > 7 && t < 15 ? 1 : 0;
    const kick = inBuild * .35 * Math.sin(2 * Math.PI * (45 + 90 * Math.exp(-bt * 30)) * bt) * Math.exp(-bt * 9);
    // riser before the logo
    const rs = Math.max(0, Math.min(1, (t - 12.5) / 2.5)) * (t < 15 ? 1 : 0);
    const riser = rs * rs * .12 * (rnd() * .5 + Math.sin(2 * Math.PI * (200 + 900 * rs) * t) * .5);
    // final chord after the logo hit
    const ct = t - 15, chord = ct > 0 ? .1 * Math.exp(-ct * .35) * [110, 164.8, 220, 329.6, 440]
      .reduce((s, f, k) => s + Math.sin(2 * Math.PI * f * t + k) / (k + 1), 0) : 0;
    let s = (d + chord) * env + kick + riser;
    L[i] += s; R[i] += s;
  }

  // anvil strikes: inharmonic partials + noise transient
  hits.forEach((h, hi) => {
    const big = hi === hits.length - 1;
    const partials = [523, 1287, 2140, 3077, 4310].map(f => f * (big ? .5 : 1));
    const start = Math.floor(h * sr), len = Math.floor((big ? 3.5 : 1.6) * sr);
    const pan = big ? 0 : [-.5, 0, .5][hi % 3];
    for (let j = 0; j < len && start + j < n; j++) {
      const t = j / sr;
      let v = 0;
      partials.forEach((f, k) => { v += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * (3 + k * 2.5)) / (k + 1); });
      v *= .28;
      v += rnd() * .4 * Math.exp(-t * 60);
      v += .5 * Math.sin(2 * Math.PI * (50 + 80 * Math.exp(-t * 25)) * t) * Math.exp(-t * 7); // body thump
      if (big) v *= 1.3;
      L[start + j] += v * (1 - pan) * .7; R[start + j] += v * (1 + pan) * .7;
    }
  });

  // soft limiter + write
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(sr, 24);
  buf.writeUInt32LE(sr * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.tanh(L[i] * .9) * 30000), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.tanh(R[i] * .9) * 30000), 46 + i * 4);
  }
  writeFileSync(path, buf);
}
