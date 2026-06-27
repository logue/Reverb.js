import { readFileSync } from 'node:fs';

import { defineConfig } from '@rsbuild/core';

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

export default defineConfig({
  output: {
    distPath: {
      root: 'docs',
    },
    assetPrefix: './',
    filenameHash: true,
  },
  html: {
    template({ entryName }) {
      const templates: Record<string, string> = {
        index: './index.html',
        localaudio: './localaudio.html',
      };

      return templates[entryName] ?? './index.html';
    },
  },
  source: {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
    entry: {
      index: './src/docs/index.ts',
      localaudio: './src/docs/localaudio.ts',
    },
  },
});
