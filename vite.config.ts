import { writeFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type UserConfig } from 'vite';
// eslint-disable-next-line import/default
import banner from 'vite-plugin-banner';
import { checker } from 'vite-plugin-checker';
// eslint-disable-next-line import/default
import dts from 'vite-plugin-dts';

import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }): UserConfig => {
  const config: UserConfig = {
    resolve: {
      // https://vitejs.dev/config/shared-options.html#resolve-alias
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
      },
    },
    // https://vitejs.dev/config/shared-options.html#base
    base: './',
    plugins: [
      // vite-plugin-checker
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        // vueTsc: true,
      }),
      // vite-plugin-banner
      // https://github.com/chengpeiquan/vite-plugin-banner
      banner(`/**
 * ${pkg.name}
 *
 * @description ${pkg.description}
 * @author ${pkg.author.name} <${pkg.author.email}>
 * @copyright 2019-${new Date().getFullYear()} By Masashi Yoshikawa All rights reserved.
 * @license ${pkg.license}
 * @version ${pkg.version}
 * @see {@link ${pkg.homepage}}
 */
`),
      // vite-plugin-dts
      // https://github.com/qmhc/vite-plugin-dts
      mode === 'docs'
        ? undefined
        : dts({ tsconfigPath: './tsconfig.app.json' }),
    ],
    // Build Options
    // https://vitejs.dev/config/#build-options
    build: {
      outDir: mode === 'docs' ? 'docs' : undefined,
      lib:
        mode === 'docs'
          ? undefined
          : {
              entry: fileURLToPath(new URL('./src/Reverb.ts', import.meta.url)),
              name: 'Reverb',
              formats: ['umd', 'es', 'iife'],
              fileName: format => `Reverb.${format}.js`,
            },
      rollupOptions: {
        input:
          mode === 'docs'
            ? {
                '': fileURLToPath(new URL('./index.html', import.meta.url)),
                localaudio: fileURLToPath(
                  new URL('./localaudio.html', import.meta.url)
                ),
              }
            : undefined,
        plugins: [
          mode === 'analyze'
            ? // rollup-plugin-visualizer
              // https://github.com/btd/rollup-plugin-visualizer
              visualizer({
                open: true,
                filename: 'dist/stats.html',
                gzipSize: true,
                brotliSize: true,
              })
            : undefined,
        ],
        external:
          mode === 'docs'
            ? []
            : [
                '@thi.ng/colored-noise',
                '@thi.ng/random',
                '@thi.ng/transducers',
              ],
        output: {
          esModule: true,
          generatedCode: {
            reservedNamesAsProps: false,
          },
          interop: 'compat',
          systemNullSetters: false,
          exports: 'named',
          globals: {
            '@thi.ng/colored-noise': 'coloredNoise',
            '@thi.ng/random': 'random',
            '@thi.ng/transducers': 'transducers',
          },
        },
      },
      target: 'esnext',
      // minify: mode === 'docs',
    },
    esbuild: {
      drop: command === 'serve' ? [] : ['console'],
    },
  };
  // Write meta data.
  writeFileSync(
    fileURLToPath(new URL('./src/Meta.ts', import.meta.url)),
    `import type MetaInterface from './interfaces/MetaInterface';

  // This file is auto-generated by the build system.
  const meta: MetaInterface = {
    version: '${pkg.version}',
    date: '${new Date().toISOString()}',
  };
  export default meta;
  `
  );
  // Export vite config
  return config;
});
