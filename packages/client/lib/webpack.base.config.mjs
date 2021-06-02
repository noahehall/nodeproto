'use strict';

import { InjectManifest } from 'workbox-webpack-plugin';
import externals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';

const msg = 'error in pack: ';

export default function pack ({
  // defaults
  babelConfig = {},
  context = process.cwd(),
  entryPush = [],
  entryUnshift = [],
  extensions = ['.mjs', '.js', '.jsx', '.json'],
  externalsConfig = { modulesFromFile: true },
  mainFields = ['module', 'browser', 'main'],
  optimization = {},
  output = { filename: '[name].js', chunkFilename: '[name].chunk.js' },
  pkgJson = {},
  plugins = [],
  publicPath = '/',
  target = 'web',

  // dependent1
  deps = Object.keys(pkgJson.dependencies || {}),
  entry = [pkgJson.main],
  mode = pkgJson.config.NODE_ENV,
  pathDist = path.resolve(context, pkgJson.directories.dist),
  pathSrc = path.resolve(context, pkgJson.directories.app),
  peerDeps = Object.keys(pkgJson.peerDependencies || {}),

  // dependent2
  ifDev = mode === 'development',
  ifProd = mode === 'production',

  // dependent3
  devtool = ifProd ? 'cheap-source-map' : 'eval-cheap-module-source-map',

  // loaders
  // should always be last to use defaults and dependents
  jsLoader = {
    test: /\.m?js$/,
    include: [pathSrc],
    use: { loader: 'babel-loader', options: babelConfig },
  },

  cssInternalLoader = {
    test: /\.css$/,
    exclude: /node_modules/,
    use: ['style-loader', 'css-loader'],
  },

  cssExternalLoader = {
    test: /\.css$/,
    include: /node_modules/,
    use: ['style-loader', 'css-loader'],
  },

  fontLoader = {
    test: /\.(eot|otf|ttf|woff|woff2)$/,
    use: 'file-loader',
  },

  svgLoader = {
    test: /\.svg$/,
    use: [{
      loader: 'svg-url-loader',
      options: {
        // Inline files smaller than 10 kB
        limit: 10 * 1024,
        noquotes: true,
      },
    }],
  },

  imageLoader = {
    test: /\.(jpg|png|gif)$/,
    use: [{
      loader: 'url-loader',
      options: {
        // Inline files smaller than 10 kB
        limit: 10 * 1024,
      },
    }],
  },

  videoLoader = {
    test: /\.(mp4|webm)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    },
  },

  htmlLoader = {},
  // doesnt work with esm? dunno
  //   test: /\.html$/,
  //   use: 'html-loader',
  // },

  // overrides top level properties
  ...overrides
} = {}) {
  if (!entry.length) throw `${msg} no enty specified`;

  return {
    context,
    devtool,
    entry: [...entryUnshift, ...entry, ...entryPush],
    externals: [ ...peerDeps, ...deps, externals(externalsConfig) ],
    mode,
    optimization,
    plugins,
    target,

    resolve: { extensions, mainFields },
    output: Object.assign({},
      {
        path: pathDist,
        publicPath,
      },
      output
    ),

    module: { rules: [
      jsLoader,
      cssInternalLoader,
      cssExternalLoader,
      fontLoader,
      svgLoader,
      imageLoader,
      htmlLoader,
      videoLoader,
    ]},

    ...overrides,
  }
}
