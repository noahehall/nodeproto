// @flasdfdow strict

import {
  buildWebpackConfig,
  reactDevWebpackConfig,
  setupWebpackConfig,
  } from '@nodeproto/buildproto';

const { pack, config } = setupWebpackConfig();

export const webpackConfig = reactDevWebpackConfig({
  pack,
  ...config,
  watch: true,
  cache: false, // TODO: not picking up changes when removing babel plugins in @nodeproto/configproto/....../client.babelrc
  devtool: 'cheap-module-source-map',
  entryUnshift: [],
  // @see https://webpack.js.org/configuration/entry-context/#entry-descriptor
  entry: {
    background: {
      filename: 'background/scriptManager.js',
      import: './src/background/scriptManager.mjs',
      layer: 'background',
    },
    browserAction: {
      filename: 'browserAction/browserAction.js',
      import: './src/browserAction/browserAction.mjs',
      layer: 'browserAction',
    },
    optionsUi: {
      filename: 'optionsUi/optionsUi.js',
      import: './src/optionsUi/optionsUi.mjs',
    },
    // pageAction: {
    //   // dependOn: 'shared',
    //   filename: 'pageAction/pageAction.js',
    //   import: './src/pageAction/pageAction.mjs',
    // },
    sidebarAction: {
      filename: 'sidebarAction/sidebarAction.js',
      import: './src/sidebarAction/sidebarAction.mjs',
    },
  },
  copyOptions: {
    patterns: [{
      // set the context
      context: pack.resolve('./src'),
      from: './**/*.(json|png)', // TODO: shouldnt need png anymore as its handled via resolveAssets webpack5 thing?
    }]
  },
  htmlOptions: [
    {
      chunks: ['background'],
      filename: 'background/scriptManager.html',
      template: pack.resolve('./src/index.html'),
    },
    {
      chunks: ['browserAction'],
      filename: 'browserAction/browserAction.html',
      template: pack.resolve('./src/index.html'),
    },
    {
      chunks: ['optionsUi'],
      filename: 'optionsUi/optionsUi.html',
      template: pack.resolve('./src/index.html'),
    },
    // {
    //   chunks: ['pageAction'],
    //   filename: 'pageAction/pageAction.html',
    //   template: pack.resolve('./src/index.html'),
    // },
    {
      chunks: ['sidebarAction'],
      filename: 'sidebarAction/sidebarAction.html',
      template: pack.resolve('./src/index.html'),
    },
  ],
  output: { path: pack.resolve('./dist') },
  pack,
});

buildWebpackConfig(webpackConfig);
