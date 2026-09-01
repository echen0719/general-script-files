#!/bin/bash

# $0 = working file name
# $1 = parameter 1: alias
# $2 = parameter 2: command

# either a one-liner or the prompts
if [[ "$#" != 2 && "$#" != 0 ]]; then
    # $# meaning parameters
    echo "Usage: $0 requires exactly two arguments"
    exit 1
fi

if [[ $1 != "" && $2 != "" ]]; then # one-liner
    echo "alias $1=\"$2\"" >> ~/.bashrc
    echo "The alias '$1' has been added for the command '$2'"
else # prompt
    echo -e "Bash Read Alias Adder\n"

    echo -e "Note: You can use script parameters to quickly add an alias"
    echo -e "with one line with $0 \"\$alias\" \"\$command\"\n"

    read -p "Alias: " alias
    read -p "Command: " command

    echo "alias $alias=\"$command\"" >> ~/.bashrc
    echo -e "\nThe alias '$alias' has been added for the command '$command'"
fi

# pretty simple bash script