#!/bin/bash

while true; do
    # By the way, $RANDOM is from 0 to 32767 so dividing by 128 does the job of numbers 0-255
    ip="$((RANDOM/128)).$((RANDOM/128)).$((RANDOM/128)).$((RANDOM/128))"

    # when grep returns exit code 0, the for loop breaks
    if nmap -p 25565 $ip -Pn | grep -q "open"; then
        echo "Open port found on $ip"
        break
    fi
done