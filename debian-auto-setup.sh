#!/bin/bash

debianPackages=("code" "firefox-esr" "flatpak" "htop" "libqt5core5a" "libqt5gui5" "libqt5network5" "libreoffice" "lxtask" "plasma-workspace-wallpapers" "plasma-discover-backend-flatpak" "vlc")

pipPackages=("aiohttp" "aiohttp_socks" "beautifulsoup4" "matplotlib" "opencv-python" "pandas" "polars" "polars-lts-cpu" "pynput" "requests" "scikit-learn" "scipy" "selenium" "torch")

installDebianPackages () {
    for package in "${debianPackages[@]}"; do
        sudo apt install "$package"
        sudo apt update
        clear
    done
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
    reboot
}

 # I don't install packages from debian repo for some reason
installPythonPackages () {
    for package in "${pipPackages[@]}"; do # similar to enchanced for loop
        # sudo pip3 install "$package" --break-system-packages # install on root as well
        pip3 install "$package" --break-system-packages
        clear
    done
}

githubDesktop () {
    # https://github.com/shiftkey/desktop
    wget -qO - https://apt.packages.shiftkey.dev/gpg.key | gpg --dearmor | sudo tee /usr/share/keyrings/shiftkey-packages.gpg > /dev/null
    sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/shiftkey-packages.gpg] https://apt.packages.shiftkey.dev/ubuntu/ any main" > /etc/apt/sources.list.d/shiftkey-packages.list'
    sudo apt update && sudo apt install github-desktop
}

# self-explainatory
googleChrome () {
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo dpkg -i google-chrome-stable_current_amd64.deb
    rm google-chrome-stable_current_amd64.deb
}

# self-explainatory
multiMc () {
    wget https://files.multimc.org/downloads/multimc_1.6-1.deb
    sudo dpkg -i multimc_1.6-1.deb
    rm multimc_1.6-1.deb
}

eclipseIDE() {
    wget https://www.eclipse.org/downloads/download.php?file=/technology/epp/downloads/release/2020-06/R/eclipse-java-2020-06-R-linux-gtk-x86_64.tar.gz
    tar -xzf eclipse-java-2020-06-R-linux-gtk-x86_64.tar.gz -C ~/.local/share # into the user applications binary folder
    rm eclipse-java-2020-06-R-linux-gtk-x86_64.tar.gz
    echo 'alias eclipse="~/.local/share/eclipse/eclipse"' >> ~/.bashrc
}

konsoleTheme () {
cat << EOF >> ~/.local/share/konsole/Dark.profile
[Appearance]
ColorScheme=Breeze
Font=Monospace,14,-1,5,50,0,0,0,0,0

[Cursor Options]
CustomCursorTextColor=255,255,255
UseCustomCursorColor=false

[General]
Command=bash
Name=Dark
Parent=FALLBACK/
EOF
} # really weird indentation

echoAlias () {
    echo 'alias python="python3"' >> ~/.bashrc
    echo 'alias javach="sudo update-alternatives --config java"' >> ~/.bashrc
    echo 'alias reboot="sudo reboot"' >> ~/.bashrc
    echo 'alias poweroff="sudo poweroff"' >> ~/.bashrc
    echo 'complete -o default java' >> ~/.bashrc
}

installDebianPackages
installPythonPackages
githubDesktop
googleChrome
multiMc
eclipseIDE
konsoleTheme
echoAlias