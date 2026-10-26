#!/bin/bash
# Cuts the generated clips and music into out/forest-stream-fish-soup-9x16.mp4 (1080x1920).
# Clean cuts, natural clip audio up front, peaceful music bed underneath, no on-screen text.
set -euo pipefail
cd "$(dirname "$0")"
B=build; mkdir -p out
IN=""; V=""; A=""; n=0; T=0
for row in $(python3 -Ic 'import json;print(" ".join("%s:%s" % (s["id"], s["seconds"]) for s in json.load(open("story.json"))["shots"]))'); do
  id=${row%%:*}; sec=${row##*:}
  IN="$IN -i $B/clip-$id.mp4"
  V="$V[$n:v]trim=0:$sec,setpts=PTS-STARTPTS[v$n];"; A="$A[$n:a]atrim=0:$sec,asetpts=PTS-STARTPTS[a$n];"
  n=$((n+1)); T=$((T+sec))
done
VC=""; AC=""; for i in $(seq 0 $((n-1))); do VC="$VC[v$i]"; AC="$AC[a$i]"; done

ffmpeg -y -loglevel error $IN -i $B/music.wav -filter_complex "
$V$A
${VC}concat=n=$n:v=1:a=0,fps=30,format=yuv420p,fade=in:st=0:d=0.6,fade=out:st=$((T-1)):d=1[v];
${AC}concat=n=$n:v=0:a=1,loudnorm=I=-18:TP=-2[sfx];
[$n:a]atrim=0:$T,volume=0.30,afade=in:d=1.5,afade=out:st=$((T-3)):d=3[mus];
[sfx][mus]amix=inputs=2:normalize=0,afade=out:st=$((T-1)):d=1,alimiter=limit=0.9[a]" \
  -map "[v]" -map "[a]" -t $T -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart out/forest-stream-fish-soup-9x16.mp4
echo "wrote out/forest-stream-fish-soup-9x16.mp4 (${T}s)"
