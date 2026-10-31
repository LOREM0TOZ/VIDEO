#!/bin/bash
# Dissolves the generated clips into out/peaceful-night-moonlight-9x16.mp4 (1080x1920), with the
# natural clip audio cross-faded the same way and the music bed running underneath end to end.
set -euo pipefail
cd "$(dirname "$0")"
B=build; mkdir -p out
read -r XF MVOL <<<"$(python3 -Ic 'import json;s=json.load(open("story.json"));print(s.get("crossfade",1.0), s.get("music_volume",0.3))')"
IDS=($(python3 -Ic 'import json;print(" ".join(str(s["id"]) for s in json.load(open("story.json"))["shots"]))'))
SECS=($(python3 -Ic 'import json;print(" ".join(str(s["seconds"]) for s in json.load(open("story.json"))["shots"]))'))
n=${#IDS[@]}
IN=""; F=""
for i in $(seq 0 $((n-1))); do
  IN="$IN -i $B/clip-${IDS[$i]}.mp4"
  F="$F[$i:v]trim=0:${SECS[$i]},setpts=PTS-STARTPTS,fps=30,format=yuv420p[v$i];[$i:a]atrim=0:${SECS[$i]},asetpts=PTS-STARTPTS[a$i];"
done
# chain xfade / acrossfade; each dissolve overlaps the previous shot by XF seconds
vprev="v0"; aprev="a0"; off=0
for i in $(seq 1 $((n-1))); do
  off=$(python3 -Ic "print(round($off + ${SECS[$((i-1))]} - $XF, 3))")
  F="$F[$vprev][v$i]xfade=transition=fade:duration=$XF:offset=$off[vx$i];[$aprev][a$i]acrossfade=d=$XF[ax$i];"
  vprev="vx$i"; aprev="ax$i"
done
T=$(python3 -Ic "print(round($off + ${SECS[$((n-1))]}, 3))")
F="$F[$vprev]fade=in:st=0:d=1,fade=out:st=$(python3 -Ic "print($T-1.5)"):d=1.5[v];"
F="$F[$aprev]loudnorm=I=-20:TP=-2[amb];"
F="$F[$n:a]atrim=0:$T,asetpts=PTS-STARTPTS,volume=$MVOL,afade=in:d=2.5,afade=out:st=$(python3 -Ic "print($T-3)"):d=3[mus];"
F="$F[amb][mus]amix=inputs=2:normalize=0,afade=out:st=$(python3 -Ic "print($T-1.5)"):d=1.5,alimiter=limit=0.9[a]"
ffmpeg -y -loglevel error $IN -i $B/music.wav -filter_complex "$F" -map "[v]" -map "[a]" -t $T \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/peaceful-night-moonlight-9x16.mp4
echo "wrote out/peaceful-night-moonlight-9x16.mp4 (${T}s)"
