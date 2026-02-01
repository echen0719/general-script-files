#!/bin/bash

# gets full path of input
src=$(realpath "$1") # just in the case file name has spaces
binout=${src%.*}

if [[ $1 == *.c ]]; then
    compiler=gcc
else
    compiler=g++
fi

# compile and run
$compiler "$src" -o "$binout"
status=$?

# if an error occurs
if [[ $status != 0 ]]; then # $? is the error code
    echo -n "You either didn't specify a valid file or have an error in your code! Error code: "; echo $status
    exit
fi

"$binout" # runs binary
echo

# auto deletion after compiling
read -p "Type 'q' to delete the compiled file or any other key to exit: " key
if [[ $key == "q" || $key == "Q" ]]; then
    rm -f $binout
    exit
else exit
fi