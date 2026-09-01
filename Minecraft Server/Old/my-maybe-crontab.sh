#!/bin/bash

# basically run ./backup.sh with additional commands

checkFolderSize () {
    size=$(du -s --block-size 1 backups/ | awk '{print $1}') # print $1 seems to print first argument, cool!
    if [ ${size} -gt 3000000000 ]; then # Why these spaces...So confusing...
        echo $(date +"%m/%d/%Y at %H:%M:%S:") Bro, clean it.
    else
        echo $(date +"%m/%d/%Y at %H:%M:%S:") Good -- Has not exceeded 3GB yet.
    fi
}

while true; # If I really think about it, it's pretty similar to Java
    do ./backup.sh
    checkFolderSize
    sleep 60m
done
