import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
export default {
  input: 'bin/src/commands.js',
  output: {
    file: 'dist/commands.cjs',
    format: 'cjs'
  },

  plugins: [
    commonjs(),
    json()
  ]
};