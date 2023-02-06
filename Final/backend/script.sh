#!/bin/bash

dir_name="./build/views"

if [ -d "$dir_name" ]; then
rm -r "$dir_name"
fi
mkdir -p "$dir_name"

cp ./views/* "$dir_name"