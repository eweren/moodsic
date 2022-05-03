#!/bin/bash
IFS=$'\n'

### Reformat sound from mp3 to ogg

# for i in $(ls);
# do
  # if [[ "$i" != *mp3 ]];
  # then
  # v2=${i%????}
  # $(ffmpeg -i $i -codec:a libmp3lame -map_metadata -1 -b:a 128k kkkk-$v2.mp3)
  # fi
# done;

### Print all durations

for i in $(ls);
do
  if [[ "$i" == *mp3 ]];
  then
    v2=${i%????}
    VAL=$(ffmpeg -i $i 2>&1 | grep Duration)
    printf "%s\n" "{artist: \"Royalty Free Music - No Copyright Music\", duration: \"$VAL\", src: \"$i\", title: \"${i%????}\", url: \"https://soundcloud.com/royaltyfreemusic-nocopyrightmusic/sets/creative-commons-music\"},"
  fi
done;