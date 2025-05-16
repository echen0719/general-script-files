#!/bin/bash

# $1 for byte size (randomness)

echo -e "Random SHA256 Generator :D\n"

if [ "$1" == "-r" ]; then
    echo "Press q to stop: "
    while true; do
        hex=$(dd if=/dev/urandom count=2 bs=$2 status=none | sha256sum | awk '{print $1}')
        echo $hex
        read -n 1 -t 0.0001 input
        if [[ "$input" == $'\x1b' ]]; then
            break
        fi
    done

else
    hex=$(dd if=/dev/urandom count=2 bs=$1 status=none | sha256sum | awk '{print $1}')
    echo $hex
fi

# dd if=/dev/urandom count=2 bs=$1 status=none | sha256sum | awk '{print $1}'
# copies random bytes from urandom with specified byte size
# then sha256sum that and prints only the first portion of the output