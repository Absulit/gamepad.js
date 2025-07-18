#!/usr/bin/env bash

npx rollup -c

swc build/gamepad.module.js \
  --out-file build/gamepad.min.js
