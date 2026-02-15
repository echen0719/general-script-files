#!/bin/bash

# $RANDOM is from 0 to 32767 so dividing by 128 does the job of numbers 0-255
generateIP() {
    while true; do
        o1=$((RANDOM % 256))
        # avoid the local and the computer reserved IP ranges
        if [ "$o1" -eq 0 ] || [ "$o1" -eq 10 ] || [ "$o1" -eq 127 ] || [ "$o1" -eq 192 ]; then
            continue
        fi; break
    done

    echo "$o1.$((RANDOM/128)).$((RANDOM/128)).$((RANDOM/128))"
}

while true; do
    ip=$(generateIP)
    # when grep returns exit code 0, the for loop breaks
    if nmap -p 25565 $ip -Pn | grep -q "open"; then
        echo "Open port found on $ip"
        break
    fi
done