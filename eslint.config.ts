import js from '@eslint/js';
import markdown from '@eslint/markdown';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import pluginVitest from '@vitest/eslint-plugin';
import { globalIgnores, defineConfig } from 'eslint/config';
import configPrettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import-x';
import pluginOxlint from 'eslint-plugin-oxlint';
// @ts-ignore
import pluginSecurity from 'eslint-plugin-security';
import tseslint from 'typescript-eslint';

import type { Linter } from 'eslint';

// Lint policy:
// 1) Keep oxlint + prettier as primary formatting/quick-check tools.
// 2) Keep ESLint focused on framework/type/import correctness.
// 3) Scope plugin presets to relevant file types to avoid cross-file crashes.
// 4) Restrict markdown lint to workspace instruction docs under .github.
// 5) Prefer small, explicit overrides over broad global exceptions.
const APP_FILES = ['**/*.{vue,ts,mts,tsx}'];
const MARKDOWN_FILES = ['.github/**/*.md'];
const UNIT_TEST_FILES = ['src/**/__tests__/*'];
const GLOBAL_IGNORES = ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'];

const markdownRecommendedConfigs = markdown.configs.recommended.map(config => ({
  ...config,
  files: MARKDOWN_FILES,
}));

const appRules: Linter.Config['rules'] = {
  '@eslint-community/eslint-comments/require-description': 'error',
  'no-unused-vars': 'off',
  // const lines: string[] = []; style
  '@typescript-eslint/array-type': [
    'error',
    {
      default: 'array',
    },
  ],
  // Enable @ts-ignore etc.
  '@typescript-eslint/ban-ts-comment': 'off',
  // Left-hand side style
  '@typescript-eslint/consistent-generic-constructors': [
    'error',
    'type-annotation',
  ],
  // Enable import sort order, see bellow.
  '@typescript-eslint/consistent-type-imports': [
    'off',
    {
      prefer: 'type-imports',
    },
  ],
  // Fix for pinia
  '@typescript-eslint/explicit-function-return-type': 'off',
  // Exclude variables with leading underscores
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      args: 'all',
      argsIgnorePattern: '^_',
      caughtErrors: 'all',
      caughtErrorsIgnorePattern: '^_',
      destructuredArrayIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      ignoreRestSiblings: true,
    },
  ],
  // Fix for vite import.meta.env
  '@typescript-eslint/strict-boolean-expressions': 'off',
  // Fix for vite env.d.ts.
  '@typescript-eslint/triple-slash-reference': 'off',
  // Fix for Vue setup style
  'import-x/default': 'off',
  // Fix for vite
  'import-x/namespace': 'off',
  'import-x/no-default-export': 'off',
  'import-x/no-named-as-default-member': 'off',
  'import-x/no-named-as-default': 'off',
  // Sort Import Order.
  // see https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md#importorder-enforce-a-convention-in-module-import-order
  'import-x/order': [
    'error',
    {
      groups: [
        'builtin',
        'external',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      pathGroups: [
        // Vue Core
        {
          pattern:
            '{vue,vue-router,vuex,@/store,vue-i18n,pinia,vite,vitest,vitest/**,@vitejs/**,@vue/**}',
          group: 'external',
          position: 'before',
        },
        // Internal Codes
        {
          pattern: '{@/**}',
          group: 'internal',
          position: 'before',
        },
      ],
      pathGroupsExcludedImportTypes: ['builtin'],
      alphabetize: {
        order: 'asc',
      },
      'newlines-between': 'always',
    },
  ],
  // Using `../` to navigate back to parent directories is completely prohibited (using `./foo` at the same level is OK).
  // Alias imports like `@/` are excluded because they resolve via the configured alias, not a relative parent path.
  'import-x/no-relative-parent-imports': ['error', { ignore: ['^@/', '^~/'] }],
};

const appSettings = {
  // This will do the trick
  'import-x/parsers': {
    espree: ['.js', '.cjs', '.mjs', '.jsx'],
    '@typescript-eslint/parser': ['.ts', '.tsx'],
    'vue-eslint-parser': ['.vue'],
  },
  'import-x/resolver': {
    // You will also need to install and configure the TypeScript resolver
    // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
    typescript: true,
    node: true,
    'eslint-import-resolver-custom-alias': {
      alias: {
        '@': './src',
        '~': './node_modules',
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
    },
  },
};

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommended,
  ...markdownRecommendedConfigs,

  globalIgnores(GLOBAL_IGNORES),

  comments.recommended,

  {
    ...pluginImport.flatConfigs.recommended,
    files: APP_FILES,
  },
  {
    ...pluginImport.flatConfigs.typescript,
    files: APP_FILES,
  },
  {
    ...pluginSecurity.configs.recommended,
    files: APP_FILES,
  },
  {
    name: 'app/rules',
    files: APP_FILES,
    settings: appSettings,
    rules: appRules,
  },

  {
    ...pluginVitest.configs.recommended,
    files: UNIT_TEST_FILES,
  },
  {
    // Test files intentionally import from parent directories (the component under test).
    name: 'test/relax-parent-imports',
    files: UNIT_TEST_FILES,
    rules: {
      'import-x/no-relative-parent-imports': 'off',
    },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),
  configPrettier,
  {
    name: 'markdown/final-overrides',
    files: MARKDOWN_FILES,
    language: 'markdown/gfm',
    rules: {
      'prettier/prettier': 'off',
    },
  }
);
