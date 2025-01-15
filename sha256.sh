#!/bin/bash

read -e -p "Enter file name or location: " file
sha256sum "$file"
