/** For build documentation site use. */
import { readFileSync } from 'node:fs';

import { defineConfig } from '@rsbuild/core';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
  version: string;
};

const buildDate = new Date().toISOString();

export default defineConfig({
  plugins: [
    pluginTypeCheck(),
  ],
  html: {
    template({ entryName }) {
      const templates: Record<string, string> = {
        index: './index.html',
        localaudio: './localaudio.html',
      };

      return templates[entryName] ?? './index.html';
    },
  },
  output: {
    assetPrefix: './',
    distPath: {
      root: 'docs',
    },
    filenameHash: true,
  },
  source: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    entry: {
      index: './src-docs/index.ts',
    },
    include: [
      './src',
    ],
    tsconfigPath: './tsconfig.rsbuild.json',
  },
});
