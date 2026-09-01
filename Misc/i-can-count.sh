#!/bin/bash

count=1
echo "There is a maximum, which I don't know, so go figure."
read -p "Speed of incrementing numbers (num/s): " speed
# for instance: $(awk "BEGIN {print 1/2}") gives out 0.5
interval=$(awk "BEGIN {print 1/$speed}")
# awk get the actual value form read -p
# which seems like best implementation

while true; do
    echo -n $count" "
    sleep $interval
    count=$((count+1))
done