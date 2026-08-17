#!/bin/bash

backupDir="backups"
worldDir="world"
logsDir="logs" # just in case

maxSize=$((3 * 1024 * 1024 * 1024)) # 3GB
interval=3600 # 1 hour

mkdir -p "$backupDir"

checkFolderSize() {
    local size

    size=$(du -s --block-size 1 "$backupDir" | awk '{print $1}')

    if [ "$size" -gt "$maxSize" ]; then
        echo "$(date "+%m/%d/%Y at %H:%M:%S:") Backups are over 3 GB. Cleaning old backups..."

        # https://stackoverflow.com/questions/27097167
        while [ "$(du -sb "$backupDir" | awk '{print $1}')" -gt "$maxSize" ]; do
            oldest=$(find "$backupDir" -type f -name "save-*.tar.xz" -printf "%T@ %p\n" | sort | head -1 | cut -d" " -f2-)
            # "cut -d" " -f2-" cuts the timestamp off

            if [ -n "$oldest" ] && [ -f "$oldest" ]; then
                echo "Deleting: $oldest"
                rm "$oldest"
            else
                break
            fi
        done
    fi
}

makeBackup() {
    timestamp=$(date "+%m-%d-%Y-%H-%M")

    echo "$(date "+%m/%d/%Y at %H:%M:%S:") Starting backup..."

    if tar -cJf "$backupDir/save-$timestamp.tar.xz" "$worldDir" "$logsDir"; then
        echo "$(date "+%m/%d/%Y at %H:%M:%S:") Backup completed successfully..."
    else
        echo "$(date "+%m/%d/%Y at %H:%M:%S:") Backup failed...IDK what happened..."
        rm -f "$backupDir/save-$timestamp.tar.xz"
    fi
}

while true; do
    makeBackup
    checkFolderSize

    echo "$(date "+%m/%d/%Y at %H:%M:%S:") Next backup in 1 hour."
    echo

    sleep "$interval"
done