const webpack = require('webpack');
const path = require('path');

const pjson = require('./package.json');

module.exports = (env) => {
  const isProduction = (env && env.production);
  return {
    mode: env,
    target: 'node',
    devtool: !isProduction ? 'source-map' : false,
    devServer: {
      contentBase: 'docs',
      open: false,
    },
    entry: {
      'reverb': './src/reverb.js',
    },
    output: {
      path: path.resolve(__dirname, 'bin'),
      filename: !isProduction ? '[name].js' : '[name].min.js',
      library: 'Reverb',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      globalObject: `(typeof self !== 'undefined' ? self : this)`,
    },
    optimization: {
      minimize: isProduction,
      splitChunks: {
        minSize: 0,
      },
      concatenateModules: false,
    },
    module: {
      rules: [
        {
          test: /\.js/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ]
        }
      ]
    },
    resolve: {
      modules: [`${__dirname}/src`, 'node_modules'],
      extensions: ['.js'],
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: `${pjson.name} v${pjson.version} | ${pjson.author.name} | license: ${pjson.license}`,
      }),
    ],
  };
};
