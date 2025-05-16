#!/bin/bash

# remove .cpp extension
name="${1%.cpp}"

# compile and run
g++ $1 -o $name

# if an error occurs
if [[ $? != 0 ]]; then # $? is the error code
    echo "You either didn't specify a valid file or have an error in your code!"
    exit
fi

./$name
echo

# auto deletion after compiling
while true; do
    read -p "Type 'q' to delete the compiled file or any other key to exit: " key
    if [[ $key == "q" || $key == "Q" ]]; then
        rm -f $name
        exit
    else exit
    fi
done