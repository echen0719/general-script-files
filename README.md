## General Script Files

A collection of Bash scripts, Windows batch files, many experiments, and other miscellaneous utilities.

Most of these were written for personal use, experimentation, or learning.

### Directory Structure

#### Checksums

Simple checksum utilities for Windows and Linux.

- `md5.sh` / `md5.bat` - Calculate an MD5 checksum for a file.
- `sha256.sh` / `sha256.bat` - Calculate a SHA-256 checksum for a file.

#### Linux Automatics

Automated Linux installation/setup scripts. These are designed specifically for myself.

- `arch-auto-setup.sh` - Automates installation and configuration of Arch Linux, including partitioning, formatting, packages, users, networking, and a desktop environment.
- `debian-auto-setup.sh` - Installs a collection of Debian and Python packages, additional software, and then configures features.

#### Minecraft Server

Minecraft server backup scripts. They are supposed to copy your world/ and logs/ directories to an archive.

- `minecraft-backup-script.sh` - Periodically backs up world/ and logs/. It has detection of world changes and automatically removes oldest backups when backup directory gets too big.
- Old/ — Previous versions of the Minecraft backup scripts.

#### Utilities

Some useful files that may help with certain tasks. Each one has a different general purpose.

- `alias-adder.sh` — Adds Bash aliases to `~/.bashrc`. Can be used interactively or with arguments:
```bash
./alias-adder.sh ls "ls --color=auto" # example
```
- `backup-root.sh` — Creates a compressed root filesystem backup with custom configs. Use the ```-h``` flag for in-depth descriptions. Sample command will look like:
```bash
./backup-root.sh -f /backup/root.tar.zst -l 19 # example
```
- `flush-swap.sh` — Disables and the enables the swap file.
- `compile-run-cx.sh` — Compiles and runs C/C++ source files, with optional deletion of compiled binary after execution
```bash
./compile-run-cx.sh program.c # example
./compile-run-cx.sh program.cpp # example
```

#### Misc

Just some small utilities and experiments.

- `i-can-count.sh` — Continuously counts upward at defined pace (have no idea why this exists)
- `ip-generator.sh` — Generates random IP addresses and searches using nmap on port 25565.
- `java-extension-bash-auto-complete-handler.sh` — Adds Bash tab completion for .java files when running ```java```.
- `random-sha256-gen.sh` — Generates SHA-256 hashes from random data.

#### System32 Wiper

A destructive Windows experiment. Like really, don't actually run these files. This was just for educational purposes.

- `System32 Wiper.bat` — Batch script that attempts to take ownership of and delete files in C:\Windows\System32.
- `System32 Wiper.exe` — Compiled version of the wiper using [https://www.battoexeconverter.com](https://www.battoexeconverter.com)