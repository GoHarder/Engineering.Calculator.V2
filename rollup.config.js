import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import includePaths from 'rollup-plugin-includepaths';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import svelte from 'rollup-plugin-svelte';
import sveltePre from 'svelte-preprocess';
import svg from 'rollup-plugin-svg';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

let includePathConfig = {
   include: {},
   paths: ['', 'src/svelte', 'public'],
   external: [],
   extensions: ['.js', '.mjs'],
};

const resolveConfig = {
   browser: true,
   dedupe: ['svelte'],
   moduleDirectories: ['node_modules'],
};

const svelteConfig = {
   preprocess: sveltePre(),
   compilerOptions: {
      dev: !production,
   },
};

const appBuild = {
   input: `src/js/app.js`,
   output: {
      sourcemap: !production,
      format: 'iife',
      name: `app`,
      file: `public/app.js`,
   },
   plugins: [
      includePaths(includePathConfig),
      svelte(svelteConfig),
      scss({ output: `public/app.css` }),
      json(),
      svg(),
      resolve(resolveConfig),
      commonjs(),
      !production && livereload('public'),
      production && terser(),
   ],
   watch: {
      clearScreen: false,
   },
};

export default [appBuild];
