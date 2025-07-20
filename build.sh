#!/usr/bin/env bash

npx rollup -c

swc build/gamepad.module.js \
  --out-file build/gamepad.min.js

echo '/* @ts-self-types="./gamepad.module.d.ts" */' | cat - build/gamepad.min.js > temp && mv temp build/gamepad.min.js

npx tsc

jsr publish --dry-run --allow-dirty