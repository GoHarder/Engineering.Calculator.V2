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
import { injectManifest } from 'rollup-plugin-workbox';
import { version } from './package.json';

const production = !process.env.ROLLUP_WATCH;

// Application

const appResolveConfig = {
   browser: true,
   dedupe: ['svelte'],
   moduleDirectories: ['node_modules'],
};

let includePathConfig = {
   include: {},
   paths: ['', 'src/svelte', 'src', 'public'],
   external: [],
   extensions: ['.js', '.mjs'],
};

const livereloadOptions = { watch: 'public', delay: 500 };

const scssConfig = {
   output: `public/app.css`,
   outputStyle: production ? 'compressed' : 'expanded',
   sourcemap: !production,
};

const svelteConfig = {
   preprocess: sveltePre(),
   compilerOptions: {
      dev: !production,
   },
};

const terserOptions = {
   format: {
      comments: false,
   },
};

const appBuild = {
   input: `src/js/app.js`,
   output: {
      sourcemap: !production,
      format: 'cjs',
      name: `app`,
      file: `public/app.js`,
   },
   plugins: [
      json(),
      svg(),
      includePaths(includePathConfig),
      resolve(appResolveConfig),
      commonjs(),
      svelte(svelteConfig),
      scss(scssConfig),
      !production && livereload(livereloadOptions),
      production && terser(terserOptions),
   ],
   watch: {
      clearScreen: false,
   },
};

// Service Worker

const injectManifestConfig = {
   swSrc: 'src/js/sw.js',
   swDest: 'public/sw.js',
   globDirectory: 'public/',
   mode: 'production',
   globPatterns: ['**/*.js', '**/*.css', '**/*.jpg', '**/*.svg', '**/*.png'],
   globIgnores: ['icons/*.png', 'img/vantage-email-logo.png'],
   additionalManifestEntries: [
      { revision: version, url: '/' },
      { revision: version, url: '/app.js' },
   ],
};

const swResolveConfig = {
   browser: true,
   dedupe: ['workbox-expiration', 'workbox-precaching', 'workbox-routing', 'workbox-strategies'],
   moduleDirectories: ['node_modules'],
};

const serviceWorker = {
   input: `src/js/sw.js`,
   output: {
      sourcemap: !production,
      format: 'es',
      name: `sw`,
      file: `public/sw.js`,
   },
   plugins: [resolve(swResolveConfig), injectManifest(injectManifestConfig)],
};

export default [appBuild, serviceWorker];
