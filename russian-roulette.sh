#!/bin/bash

# what do I do in my free time

echo -e "\nYou are currently playing Russian Roulette (my edition)."
echo "Every hour, your computer will spin and pull the trigger."
echo "If your luck runs out, your /home/$USER will be deleted."
echo -e "Good Luck! You will need it...\n"

# or else /home/$USER will be gone in a few hours
bullet=$(( RANDOM % 50 + 1 )) # random chamber from 1 to 50 for long "play" time
chamber=1 # start from 1

russian_roulette () {
    echo -e "\n\nPulling the trigger on chamber $chamber..."
    if [ $chamber -eq $bullet ]; then
        echo -e "\n💀 POW! Chamber $chamber had the bullet!"
        rm -r "/home/$USER/"
        exit
    else
        echo -e "\n😌 Click! Chamber $chamber was empty. You're safe...for now.\n"
    fi
    chamber=$((chamber + 1))
}

while true; do # runs every 60 minutes (hour)
    echo "Next spin in 60 minutes..."

    for ((min=59; min>=0; min--)); do # does sure look like java
        for ((sec=59; sec>=0; sec--)); do
            printf "\r⏳ Time until next spin: %02d:%02d " "$min" "$sec" # never knew about a printf function
            sleep 1
        done
    done

    russian_roulette
done