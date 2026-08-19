import { mergeRslibConfig } from '@rslib/core';
import type { StorybookConfig } from 'storybook-html-rsbuild';

const config: StorybookConfig = {
  framework: 'storybook-html-rsbuild',
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  rsbuildFinal: (config) => {
    return mergeRslibConfig(config, {
      source: {
        tsconfigPath: './tsconfig.storybook.json',
      },
    });
  },
};

export default config;
