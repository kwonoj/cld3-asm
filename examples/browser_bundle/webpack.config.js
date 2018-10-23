const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  mode: 'development',
  module: {
    /**
     * Override default rules to avoid parsing wasm file as module
     */
    defaultRules: [
      {
        type: 'javascript/auto',
        resolve: {}
      }
    ],
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          compilerOptions: {
            module: 'esnext',
            skipLibCheck: true,
            skipDefaultLibCheck: true
          }
        }
      },
      /**
       * Bundle wasm binary as dataUri in javascript.
       */
      {
        test: /\.wasm$/,
        loader: 'url-loader',
        options: {
          name: '[name]-[hash].[ext]'
        }
      }
    ]
  },
  target: 'web',
  node: {
    fs: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.ejs'
    })
  ]
};
