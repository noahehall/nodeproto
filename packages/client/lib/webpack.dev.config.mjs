'use strict';

import { envproto } from '@nodeproto/lib';
import babelConfig from './babel.config.mjs';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import pkgJsonOG from '../package.json';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import webpack from 'webpack';
import webpackBaseConfig from './webpack.base.config.mjs';

// syncs pkgjson.config with .env values
const pkgJson = envproto.syncConfig(pkgJsonOG);

const context = process.cwd();
const pathDist = path.resolve(context, pkgJson.directories.dist);

export default webpackBaseConfig({
  babelConfig: babelConfig(),
  context,
  pkgJson,

  plugins: [

    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      template: pkgJson.config.HTML_INDEX,
    }),

    new ScriptExtHtmlWebpackPlugin({
      module: /(workers|sw)/,
    }),
  ],
  devServer: {
    contentBase: pathDist,
    hot: true,
  },
});
