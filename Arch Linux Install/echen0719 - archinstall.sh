#!/bin/bash

## Use for install on entire disk (clean)

efi_size="1G"
swap_size="2G"
root_size=
filesystem=ext4

## base base-devel linux linux-headers linux-firmware dkms iwd archlinux-keyring sudo nano dosfstools systemd
## networkmanager dhcpcd man-db man-pages firefox dolphin lxde prismlauncher ark kate spectacle code obs-studio cheese vlc steam htop partitionmanager neofetch xorg-server xorg xorg-xinit xorg-xauth slim python jdk-openjdk jdk8-openjdk jdk17-openjdk cups pipewire ncdu 7zip git

ip a | grep wlan

read -p "Enter the WIFI SSID: " ssid
read -p "Enter the WIFI Device:  " w_device
read -p "Enter the WIFI Pass  " passphrase

iwctl --passphrase="$passphrase" station "$w_device" connect "$ssid"
timedatectl set-ntp true

read -p "Enter the device path (i.e. /dev/nvme0n1): " device

boot_dev="${device}1"
root_dev="${device}2"
swap_dev="${device}3"

sfdisk /dev/"$device" << EOF
boot_dev : start=2048, size=+$efi_size, type=0FC63DAF-8483-4772-8E79-3D69D8477DE4, bootable
swap_dev : size=+$swap_size, type=0657FD6D-A4AB-43C4-84E5-0933C84B4F4F
root_dev: type=0FC63DAF-8483-4772-8E79-3D69D8477DE4
EOF

mkfs.fat -F 32 "$boot_dev"
mkfs.ext4 "$root_dev"
mkswap "$swap_dev"

mount "$root_dev" /mnt
mkdir /mnt/boot
mount "$boot_dev" /mnt/boot
swapon "$swap_dev"

pacstrap -K /mnt base base-devel linux linux-headers linux-firmware dkms iwd archlinux-keyring sudo nano dosfstools systemd

genfstab -U /mnt >> /mnt/etc/fstab

arch-chroot /mnt ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime
arch-chroot /mnt hwclock --systohc --localtime

arch-chroot /mnt sed -i "s/#en_US.UTF-8/en_US.UTF-8/g" /etc/locale.gen
export LANG=en_US.UTF-8
"archer" > /mnt/etc/hostname

cat > /mnt/etc/hosts <<HOSTS
127.0.0.1      localhost
::1            localhost
127.0.1.1      archer.localdomain     archer
HOSTS

arch-chroot /mnt passwd

arch-chroot /mnt pacman -S networkmanager dhcpcd man-db man-pages firefox dolphin lxde prismlauncher ark kate spectacle code obs-studio cheese vlc steam htop partitionmanager neofetch xorg-server xorg xorg-xinit xorg-xauth slim python jdk-openjdk jdk8-openjdk jdk17-openjdk cups pipewire ncdu 7zip git
arch-chroot /mnt systemctl enable dhcpcd.service
arch-chroot /mnt systemctl enable NetworkManager.service

arch-chroot /mnt sed -i 's/# %wheel/%wheel/g' /etc/sudoers
arch-chroot /mnt sed -i 's/%wheel ALL=(ALL) NOPASSWD: ALL/# %wheel ALL=(ALL) NOPASSWD: ALL/g' /etc/sudoers
arch-chroot /mnt useradd -m -G wheel "echen0719"
arch-chroot /mnt passwd "echen0719"

arch-chroot bootctl install

arch-chroot rm /etc/X11/xinit/xinitrc
arch-chroot cp xinitrc /etc/X11/xinit/xinitrc
# I should probably change

# Big thanks to

# https://github.com/deepbsd/Farchi | DeepBSD
# https://wiki.archlinux.org/title/Installation_guide | Writers of Arch Wiki
