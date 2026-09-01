#!/bin/bash

if [ "$EUID" -ne 0 ]; then
    echo "[-] Please run this script as root"
    exit 1
fi

algorithm="zstd"
compression_level=15
destination="/mnt/root-backup.tar.zst"

exclusions=(/proc /sys /dev /run /mnt /lost+found /tmp/ /var/tmp /var/cache /var/log)
addition_exclusions=()

usage() {
    echo -e "Usage: ./backup-root.sh [options]\n\n"

    echo -e "Options:\n"

    echo -e "-f FILE\t\toutput location (default: $destination)"
    echo -e "-a ALGORITHM\ttar algorithm (default: $algorithm)"
    echo -e "-l LEVEL\ttar compression level (default: $compression_level)"
    echo -e "-e EXCLUSIONS\tadd another exclusion for backup\n"

    echo -e "Example:\n"
    echo -e "./backup-root.sh -f /backup/root.tar.zst -l 19 -e \"/home/*/.cache\""
}

# getopts is so useful for this and easy to use
while getopts ":f:a:l:e:h" option; do
    if [ "$option" = "f" ]; then
        destination="$OPTARG" # need to remember this for the future
    elif [ "$option" = "a" ]; then
        algorithm="$OPTARG"
    elif [ "$option" = "l" ]; then
        compression_level="$OPTARG" # optional argument
    elif [ "$option" = "e" ]; then
        addition_exclusions+=("$OPTARG")
    elif [ "$option" = "h" ]; then
        usage
        exit 0
    else
        echo "Invalid option or missing argument"
        exit 1
    fi
done

if [[ "$algorithm" = "zstd" || "$algorithm" = "xz" ]]; then
    compression_flag="$algorithm -$compression_level -T0"
else
    compression_flag="$algorithm -$compression_level"
fi

combined_exclusions=()
for exclusion in "${exclusions[@]}" "${addition_exclusions[@]}"; do
    combined_exclusions+=("--exclude=$exclusion")
done # {array[@]} gets all

combined_exclusions+=("--exclude=$destination")

tar -I "$compression_flag" --xattrs -cpf "$destination" "${combined_exclusions[@]}" /
