#!/bin/bash
# Cuts the generated clips, titles and music into the final edits:
#   out/mud-crab-curry-16x9.mp4  (1920x1080)
#   out/mud-crab-curry-4x5.mp4   (1080x1350, centre crop for Instagram)
set -euo pipefail
cd "$(dirname "$0")"
B=build; mkdir -p out
ORDER=$(python3 -Ic 'import json;print(" ".join(str(s["id"]) for s in json.load(open("story.json"))["shots"]))')
IN=""; V=""; A=""; n=0
for id in $ORDER; do IN="$IN -i $B/clip-$id.mp4"; V="$V[$n:v]"; A="$A[$n:a]"; n=$((n+1)); done
T=$(python3 -Ic "print(4*$n)")

ffmpeg -y -loglevel error $IN -i $B/music.wav -loop 1 -i $B/title-open.png -loop 1 -i $B/title-end.png -filter_complex "
${V}concat=n=$n:v=1:a=0,settb=1/30,fps=30,format=yuv420p[cut];
[$((n+1)):v]format=rgba,trim=0:3.4,fade=in:st=0.3:d=0.7:alpha=1,fade=out:st=2.6:d=0.8:alpha=1,setpts=PTS-STARTPTS[t1];
[$((n+2)):v]format=rgba,trim=0:$T,fade=in:st=$(python3 -Ic "print($T-4)"):d=0.8:alpha=1[t2];
[cut][t1]overlay=enable='lt(t,3.4)'[v1];
[v1][t2]overlay=shortest=1,fade=in:st=0:d=0.5,fade=out:st=$(python3 -Ic "print($T-0.8)"):d=0.8[v];
${A}concat=n=$n:v=0:a=1,loudnorm=I=-18:TP=-2[sfx];
[$n:a]atrim=0:$T,volume=0.32,afade=in:d=1.2,afade=out:st=$(python3 -Ic "print($T-2.5)"):d=2.5[mus];
[sfx][mus]amix=inputs=2:normalize=0,afade=out:st=$(python3 -Ic "print($T-0.8)"):d=0.8,alimiter=limit=0.9[a]" \
  -map "[v]" -map "[a]" -t $T -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/mud-crab-curry-16x9.mp4

ffmpeg -y -loglevel error -i out/mud-crab-curry-16x9.mp4 -vf "crop=864:1080,scale=1080:1350:flags=lanczos" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart out/mud-crab-curry-4x5.mp4
echo "wrote out/mud-crab-curry-16x9.mp4 out/mud-crab-curry-4x5.mp4"
