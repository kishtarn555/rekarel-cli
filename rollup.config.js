import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
export default {
  input: 'bin/commands.js',
  output: {
    file: 'dist/commands.cjs',
    format: 'cjs'
  },

  plugins: [
    commonjs()
  ]
};