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
