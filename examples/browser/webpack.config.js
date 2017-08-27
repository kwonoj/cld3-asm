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
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  devServer: {
    contentBase: path.join(__dirname, '../../')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.ejs'
    })
  ]
};
