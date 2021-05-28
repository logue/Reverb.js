module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['./node_modules/gts/'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: ['webpack.config.ts'],
      rules: {
        'node/no-unpublished-import': 'off',
      },
    },
  ],
  rules: {},
};
