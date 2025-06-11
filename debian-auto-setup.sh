#!/bin/bash

debianPackages=("code" "firefox-esr" "flatpak" "libqt5core5a" "libqt5gui5" "libqt5network5" "plasma-discover-backend-flatpak")

pipPackages=("aiohttp" "aiohttp_socks" "beautifulsoup4" "matplotlib" "opencv-python" "pandas" "polars" "polars-lts-cpu" "pynput" "requests" "scikit-learn" "scipy" "selenium" "torch")

installDebianPackages() {
    for package in "${debianPackages[@]}"; do
        sudo apt install "$package"
        sudo apt update
    done
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
    reboot
}

 # I don't install packages from debian repo for some reason
installPythonPackages () {
    for package in "${pipPackages[@]}"; do # similar to enchanced for loop
        # sudo pip3 install "$package" --break-system-packages # install on root as well
        pip3 install "$package" --break-system-packages
    done
}

githubDesktop () {
    # https://github.com/shiftkey/desktop
    wget -qO - https://apt.packages.shiftkey.dev/gpg.key | gpg --dearmor | sudo tee /usr/share/keyrings/shiftkey-packages.gpg > /dev/null
    sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/shiftkey-packages.gpg] https://apt.packages.shiftkey.dev/ubuntu/ any main" > /etc/apt/sources.list.d/shiftkey-packages.list'
    sudo apt update && sudo apt install github-desktop
}

googleChrome () {
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo dpkg -i google-chrome-stable_current_amd64.deb
    rm -r google-chrome-stable_current_amd64.deb
}

multiMc () {
    wget https://files.multimc.org/downloads/multimc_1.6-1.deb
    sudo dpkg -i multimc_1.6-1.deb
    rm -r multimc_1.6-1.deb
}



installPythonPackages