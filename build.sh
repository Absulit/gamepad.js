#!/usr/bin/env bash

esbuild src/entries.js \
    --bundle \
    --minify \
    --keep-names \
    --format=esm \
    --target=es2020 \
    --outfile=build/gamepad.min.js