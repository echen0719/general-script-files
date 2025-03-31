#!/bin/bash

# what do I do in my free time

echo
echo "You are currently playing Russian Roulette (my edition)."
echo "Every hour, your computer will spin and pull the trigger."
echo "If your luck runs out, your /home/$USER will be deleted."
echo "Good Luck! You will need it..."
echo

russian_roulette () {
    random=$(($RANDOM % 6 + 1)) # 1, 2, 3, 4, 5, 6
    if [ $random -eq 6 ]; then
        echo "💀 POW! You lost!"
        rm -r "/home/$USER/"
        exit
    else
        echo "😌 Click! You're safe...for now."
    fi
}

while true; do # runs every 60 minutes (hour)
    echo "Next spin in 60 minutes..."

    for ((min=59; min>=0; min--)); do # does sure look like java
        for ((sec=59; sec>=0; sec--)); do
            printf "\r⏳ Time until next spin: %02d:%02d " "$min" "$sec" # never knew about a printf function
            sleep 1
        done
    done

    sleep 60m
    echo

    russian_roulette
done