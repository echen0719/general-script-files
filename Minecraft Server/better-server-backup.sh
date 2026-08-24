#!/bin/bash

backupDir="backups"
worldDir="world" # world and logs exists on all, can be changed
logsDir="logs" # just in case
tmuxSession="shared"

maxSize=$((3 * 1024 * 1024 * 1024)) # 3GB
interval=3600 # 1 hour
previousHash="" # for comparison

mkdir -p "$backupDir"

checkFolderSize() {
    local size

    size=$(du -sb --block-size 1 "$backupDir" | awk '{print $1}')

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
    local currentHash
    timestamp=$(date "+%m-%d-%Y-%H-%M")

    tmux send-keys -t "$tmuxSession" "save-all" C-m
    sleep 15

    echo "$(date "+%m/%d/%Y at %H:%M:%S:") Checking for changes..."
    currentHash=$(find "$worldDir" -type f -print0 | sort -z | xargs -0 sha1sum | sha1sum | awk '{print $1}')
    # https://stackoverflow.com/questions/545387

    if [ "$currentHash" = "$previousHash" ]; then
        echo "$(date "+%m/%d/%Y at %H:%M:%S:") No changes detected. Skipping backup..."
        return
    fi

    echo "$(date "+%m/%d/%Y at %H:%M:%S:") Starting backup..."

    if tar -cJf "$backupDir/save-$timestamp.tar.xz" "$worldDir" "$logsDir"; then
        echo "$(date "+%m/%d/%Y at %H:%M:%S:") Backup completed successfully..."
        previousHash="$currentHash"
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