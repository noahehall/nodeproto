import * as pack from './webpack.setup.mjs';
import webpackBaseConfig from './webpack.base.config.mjs';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// @see https://webpack.js.org/guides/production/
export default webpackBaseConfig({
  publicPath: './',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      template: pack.env.config.HTML_INDEX,
    }),
  ]
})
