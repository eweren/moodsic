#!/bin/bash
IFS=$'\n'

### Reformat sound from mp3 to ogg

# for i in $(ls);
# do
#   if [[ "$i" == *mp3 ]];
#   then
#     v2=${i%????}
#     $(ffmpeg -i $i -map_metadata -1 $v2.ogg)
#   fi
# done;

### Print all durations

# for i in $(ls);
# do
#   if [[ "$i" == *ogg ]];
#   then
#     v2=${i%????}
#     VAL=$(ffmpeg -i $i 2>&1 | grep Duration)
#     printf "%s\n" "$i- $VAL"
#   fi
# done;