#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Error: This script must be run with root."
  exit 1
fi

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <rotation>" # should have been using $0
    exit 1
fi

if ! [[ "$1" =~ ^[0-3]$ ]]; then
    echo "Error: Rotation must be 0, 1, 2, or 3."
    exit 1
fi

grubConf="/etc/default/grub"
systemdConfDir="/boot/loader/entries/"
rotateValue="fbcon=rotate:$1"

grubRotate() {
    echo "Trying grub configuration..."

    if [ ! -f "$grubConf" ]; then
        echo "GRUB config not found at $grubConf."
        return 1
    fi

    variable="GRUB_CMDLINE_LINUX_DEFAULT"

    if ! grep -q "^${variable}=" "$grubConf"; then
        echo "$variable not found in config at $grubConf."
        return 1
    fi

    if grep -qE "^${variable}=\"[^\"]*fbcon=rotate:[0-3]([[:space:]]|\"|$)" "$grubConf"; then
        sed -i -E "s|(^${variable}=\"[^\"]*)fbcon=rotate:[0-3]|\1${rotateValue}|" "$grubConf" # if fbcon exists, just change the value
    else
        sed -i -E "s|(^${variable}=\"[^\"]*)\"$|\1 ${rotateValue}\"|" "$grubConf" # matches until last quote and inserts rotateValue plus a quote
    fi

    if ! grub-mkconfig -o /boot/grub/grub.cfg; then
        echo "Error: grub-mkconfig failed."
        return 1
    fi

    return 0
}

systemdRotate() {
    echo "Trying systemd configuration..."

    if [ ! -d "$systemdConfDir" ]; then
        echo "Systemd entries not found at $systemdConfDir."
        return 1
    fi

    for file in "$systemdConfDir"*.conf; do
        if [ -f "$file" ]; then
            if grep -qE "^options[[:space:]].*([[:space:]])fbcon=rotate:[0-3]([[:space:]]|$)" "$file"; then
                sed -i -E "s|(^options .*)fbcon=rotate:[0-3]|\1${rotateValue}|" "$file" # same here
            else
                sed -i -E "s|^options (.*)$|options \1 ${rotateValue}|" "$file" # same here
            fi
        else
            echo "$file is not a valid file or boot entry"
        fi
    done

    return 0
}

if grubRotate; then
    echo "GRUB done for rotation $1"
    exit 0
fi

if systemdRotate; then
    echo "systemd done for rotation $1"
    exit 0
fi

echo "Yeah...nothing seemed to worked"
exit 1