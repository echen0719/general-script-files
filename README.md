# Programs with Caution Required

There are multiple files in this repository. Most of these are scripts files and others are prerequisites or outputs.

## Current File List: 

- **📁 System32 Wiper**: Folder made for fun, but is dangerous. Use with extreme caution
- **📄 sha256.bat**/**sha256.sh**: Takes the SHA256SUM hash of specified files
- **📄 Arch Linux Install/echen0719 - archinstall.sh**: Unfinished install script that install Arch Linux
- **📄 Minecraft Server/zipped-world-backup.sh**: Saves a server's world folder as a tar.xz file
- **📄 Minecraft Server/my-maybe-crontab.sh**: A "cronjob" that runs ./zipped-world-backup.sh every hour

## Check Hash: 

**Why?** Because corrupt or modified files are dangerous! 

**SHA-256**: 
- Windows: certutil -hashfile X:/location/to/file SHA256
- Linux: sha256sum /location/to/file
- Or you can use sha256.bat/sha256.sh

**MD5**: 
- Windows: certutil -hashfile X:/location/to/file MD5
- Linux: md5sum /location/to/file
- Or you can use md5.bat/md5.sh

## Tools Used:

- Editor: Notepad (Windows) + Kate (KDE)
- Terminal: Command Prompt (Windows) + Konsole (KDE)
- EXE compiler: IExpress
- EXE Editor: [Resource Hacker](https://github.com/qb40/resource-hacker)

**Any use of these programs are entirely your responsiblity. Do not install these on other people's computers without their permission. For educational purposes only!!**
