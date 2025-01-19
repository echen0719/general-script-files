#!/bin/bash

## Use for install on entire disk (clean)

## base base-devel linux linux-headers linux-firmware dkms iwd archlinux-keyring sudo nano dosfstools systemd
## networkmanager dhcpcd man-db man-pages firefox dolphin lxde prismlauncher ark kate spectacle code obs-studio cheese vlc steam htop partitionmanager neofetch xorg-server xorg xorg-xinit xorg-xauth slim python jdk-openjdk jdk8-openjdk jdk17-openjdk cups pipewire ncdu 7zip git

ip a | grep wlan

read -p "Enter the WIFI SSID: " ssid
read -p "Enter the WIFI Device:  " w_device
read -p "Enter the WIFI Pass: " passphrase

iwctl --passphrase="$passphrase" station "$w_device" connect "$ssid"
timedatectl set-ntp true

read -p "Enter the device path (i.e. /dev/nvme0n1): " device

boot_dev="${device}1"
swap_dev="${device}2"
root_dev="${device}3"

sfdisk --delete $device

root_size=
filesystem=ext4

read -p "Enter EFI Size (i.e. 1G):  " efi_size
read -p "Enter Swap Size (i.e. 2G):  " swap_size

sfdisk $device << EOF
    label: gpt
    $boot_dev : size=1G, type=C12A7328-F81F-11D2-BA4B-00A0C93EC93B
    $swap_dev : size=2G, type=0657FD6D-A4AB-43C4-84E5-0933C84B4F4F
    $root_dev : type=0FC63DAF-8483-4772-8E79-3D69D8477DE4
EOF

mkfs.vfat -F32 "$boot_dev"
mkswap "$swap_dev"
mkfs.ext4 "$root_dev"

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

echo -e "127.0.0.1      localhost\n::1            localhost\n127.0.1.1      archer.localdomain     archer" > /mnt/etc/hosts

arch-chroot /mnt passwd

arch-chroot /mnt pacman -S networkmanager dhcpcd man-db man-pages firefox dolphin lxde prismlauncher ark kate spectacle code obs-studio cheese vlc steam htop partitionmanager neofetch xorg-server xorg xorg-xinit xorg-xauth slim python jdk-openjdk jdk8-openjdk jdk17-openjdk cups pipewire ncdu 7zip git
arch-chroot /mnt systemctl enable dhcpcd.service
arch-chroot /mnt systemctl enable NetworkManager.service

read -p "Username:  " username

arch-chroot /mnt sed -i 's/# %wheel/%wheel/g' /etc/sudoers
arch-chroot /mnt sed -i 's/%wheel ALL=(ALL) NOPASSWD: ALL/# %wheel ALL=(ALL) NOPASSWD: ALL/g' /etc/sudoers
arch-chroot /mnt useradd -m -G wheel "$username"
arch-chroot /mnt passwd "$username"

arch-chroot bootctl install

arch-chroot echo -e "#!/bin/sh\n\nuserresources=\$HOME/.Xresources\nusermodmap=\$HOME/.Xmodmap\nsysresources=/etc/X11/xinit/.Xresources\nsysmodmap=/etc/X11/xinit/.Xmodmap\n\n# merge in defaults and keymaps\n\nif [ -f \$sysresources ]; then\n    xrdb -merge \$sysresources\nfi\n\nif [ -f \$sysmodmap ]; then\n    xmodmap \$sysmodmap\nfi\n\nif [ -f "\$userresources" ]; then\n    xrdb -merge "\$userresources"\nfi\n\nif [ -f "\$usermodmap" ]; then\n    xmodmap "\$usermodmap"\nfi\n\nstartlxde" > /etc/X11/xinit/xinitrc

arch-chroot chmod u+x /etc/X11/xinit/xinitrc

# Big thanks to

# https://github.com/deepbsd/Farchi | DeepBSD
# https://wiki.archlinux.org/title/Installation_guide | Writers of Arch Wiki
