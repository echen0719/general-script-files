#!/bin/bash

name="${1%.cpp}"

g++ $1 -o $name
./$name

echo

while true; do
    read -p "Type 'q' to delete the compiled file: " key
    if [[ "$key" == "q" || "$key" == "Q" ]]; then
        rm -f "$name"
        break
    fi
done