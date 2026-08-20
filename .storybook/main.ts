import { mergeRslibConfig } from '@rslib/core';
import remarkGfm from 'remark-gfm';
import type { StorybookConfig } from 'storybook-html-rsbuild';

import rehypePreMermaid from './rehype-pre-mermaid';

const config: StorybookConfig = {
  framework: 'storybook-html-rsbuild',
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypePreMermaid],
          },
        },
      },
    },
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
