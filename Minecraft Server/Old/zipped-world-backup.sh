#!/bin/bash

mkdir -p backups

cp -r world tempFolder
tar -cJf backups/world-$(date +\%m-\%d-\%Y-\%H-\%M).tar.xz tempFolder
rm -r tempFolder
