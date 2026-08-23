#!/bin/bash
cd "$(dirname "$0")/.."
find public/photos -name "*.baiduyun*" -delete 2>/dev/null
find public/photos -name ".DS_Store" -delete 2>/dev/null
compressed=0
while IFS= read -r f; do
  sz=$(stat -f%z "$f")
  if [ "$sz" -gt 1200000 ]; then
    sips -Z 2000 -s format jpeg -s formatOptions 80 "$f" --out "$f.tmp.jpg" >/dev/null 2>&1 && mv "$f.tmp.jpg" "$f" && compressed=$((compressed+1))
  fi
done < <(find public/photos -type f -name "*.jpg")
mkdir -p public/photos-thumb
thumbs=0
while IFS= read -r f; do
  rel="${f#public/photos/}"
  out="public/photos-thumb/${rel%.jpg}.jpg"
  mkdir -p "$(dirname "$out")"
  if [ ! -f "$out" ] || [ "$f" -nt "$out" ]; then
    sips -Z 480 -s format jpeg -s formatOptions 72 "$f" --out "$out" >/dev/null 2>&1 && thumbs=$((thumbs+1))
  fi
done < <(find public/photos -type f -name "*.jpg")
dups=$(find public/photos -type f -name "*.jpg" -exec md5 -q {} \; | sort | uniq -d | wc -l | tr -d ' ')
echo "压缩 $compressed 张大图，更新 $thumbs 张缩略图"
[ "$dups" -gt 0 ] && echo "⚠ 发现 $dup 组内容重复的照片，建议手动清理"
