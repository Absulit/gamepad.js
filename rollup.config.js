export default {
  input: 'src/entries.js',
  output: {
    file: 'build/gamepad.module.js',
    format: 'esm',
    banner: '/* @ts-self-types="./gamepad.module.d.ts" */'
  },
  plugins: []
};
