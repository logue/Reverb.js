/** For build library use */
import { readFileSync } from 'node:fs';

import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { defineConfig } from '@rslib/core';

const umdName = 'Reverb';
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  name: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
  license: string;
  version: string;
  homepage: string;
};

const buildDate = new Date().toISOString();
const bannerText = `/**
* ${pkg.name}
*
* @description ${pkg.description}
* @author ${pkg.author.name} <${pkg.author.email}>
* @copyright 2019-2026 By Masashi Yoshikawa All rights reserved.
* @license ${pkg.license}
* @version ${pkg.version}
* @see {@link ${pkg.homepage}}
*/
`;

export default defineConfig({
  plugins: [
    pluginTypeCheck(),
  ],
  lib: [
    {
      banner: {
        js: bannerText,
      },
      dts: {
        // isolated: true,  // SWC fast_dts
        bundle: true,
        tsgo: true, // Enable TypeScript 7 native compiler
      },
      format: 'esm',
      output: {
        filename: {
          js: 'index.es.js',
        },
        sourceMap: true,
      },
    },
    {
      banner: {
        js: bannerText,
      },
      format: 'umd',
      output: {
        cleanDistPath: false,
        filename: {
          js: 'index.umd.js',
        },
        minify: true,
        sourceMap: true,
      },
      umdName,
    },
  ],
  source: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    tsconfigPath: './tsconfig.rslib.json',
  },
});
