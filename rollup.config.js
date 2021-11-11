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
   external: [],
   extensions: ['.js'],
};

const resolveConfig = {
   browser: true,
   dedupe: ['svelte'],
   moduleDirectories: ['node_modules', 'public'],
};

const svelteConfig = {
   preprocess: sveltePre(),
   compilerOptions: {
      dev: !production,
   },
};

const pageConfig = (fileName) => {
   return {
      input: `src/js/${fileName}.js`,
      output: {
         sourcemap: true,
         format: 'iife',
         name: `${fileName}Store`,
         file: `/public/pages/${fileName}/script.js`,
      },
      plugins: [
         includePaths(includePathConfig),
         svelte(svelteConfig),
         scss({ output: `/public/pages/${fileName}/style.css` }),
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
};

const indexPage = pageConfig('index');

export default [indexPage];
