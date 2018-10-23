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
          /**
           * Keep TypeScript errors from preventing dev builds,
           * to speed up iteration time.
           */
          transpileOnly: true,
          compilerOptions: {
            module: 'esnext',
            /**
             * Do not check lib as well, as we're doing transpile only
             * doesn't have meaning to check lib types as well.
             */
            skipLibCheck: true,
            skipDefaultLibCheck: true
          }
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.ejs'
    })
  ]
};
