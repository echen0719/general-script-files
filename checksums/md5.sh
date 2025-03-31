#!/bin/bash

read -e -p "Enter file name or location: " file
md5sum "$file"
