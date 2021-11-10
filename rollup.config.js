import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import rootImport from 'rollup-plugin-root-import';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import svelte from 'rollup-plugin-svelte';
import sveltePre from 'svelte-preprocess';
import svg from 'rollup-plugin-svg';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const svelteConfig = {
   preprocess: sveltePre(),
   compilerOptions: {
      dev: !production,
   },
};

const appConfig = {
   input: 'src/js/index.js',
   output: {
      sourcemap: true,
      format: 'iife',
      name: 'index',
      file: 'public/index.js',
   },
   plugins: [
      rootImport({
         root: __dirname,
         useInput: 'prepend',
         extensions: '.js',
      }),
      svelte(svelteConfig),
      scss({ output: 'public/style.css' }),
      json(),
      svg(),
      resolve({ browser: true, dedupe: ['svelte'] }),
      commonjs(),
      !production && livereload('public'),
      production && terser(),
   ],
   watch: {
      clearScreen: false,
   },
};

export default [appConfig];
