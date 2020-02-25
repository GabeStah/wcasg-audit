import alias from '@rollup/plugin-alias';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';

export default {
  external: ['lodash'],
  input: ['src/index.ts'],
  output: {
    file: pkg.main,
    format: 'umd',
    name: pkg.name,
    sourcemap: true
  },
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: 'src' },
        { find: 'config', replacement: 'config' },
        { find: 'types', replacement: 'src/types' }
      ]
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    json(),
    typescript({
      typescript: require('typescript')
    }),
    terser(),
    commonjs({
      include: /node_modules/,
      namedExports: {
        'node_modules/lodash/index.js': ['transform']
      }
    })
  ]
};
