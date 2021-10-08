// @flasdfdow strict

import {
  buildWebpackConfig,
  reactDevWebpackConfig,
  setupWebpackConfig,
  } from '@nodeproto/buildproto';

const { pack, config } = setupWebpackConfig();

export const webpackConfig = reactDevWebpackConfig({
  ...config,
  devtool: 'cheap-module-source-map',
  entryUnshift: [],
  // @see https://webpack.js.org/configuration/entry-context/#entry-descriptor
  entry: {
    // pretty sure this is broken @see https://github.com/mozilla/webextension-polyfill/#basic-setup
    // this breaks $ pnpm build
    // shared: ['@babel/runtime', 'react', 'react-dom', 'webextension-polyfill'],
    contextMenu: {
      // dependOn: 'shared',
      filename: 'background/contextMenu.js',
      import: './src/background/contextMenu.mjs',
      layer: 'background',
    },
    network: {
      // dependOn: 'shared',
      filename: 'background/network.js',
      import: './src/background/network.mjs',
      layer: 'background',
    },
    browserAction: {
      // dependOn: 'shared',
      filename: 'browserAction/browserAction.js',
      import: './src/browserAction/browserAction.mjs',
      layer: 'browserAction',
    },
    optionsUi: {
      // dependOn: 'shared',
      filename: 'optionsUi/optionsUi.js',
      import: './src/optionsUi/optionsUi.mjs',
    },
    pageAction: {
      // dependOn: 'shared',
      filename: 'pageAction/pageAction.js',
      import: './src/pageAction/pageAction.mjs',
    },
    sidebarAction: {
      // dependOn: 'shared',
      filename: 'sidebarAction/sidebarAction.js',
      import: './src/sidebarAction/sidebarAction.mjs',
    },
  },
  copyOptions: {
    patterns: [{
      // set the context
      context: pack.resolve('./src'),
      from: './**/*.(json|png|css)',
    }]
  },
  htmlOptions: [
    {
      chunks: ['browserAction'], // ['shared', 'browserAction']
      filename: 'browserAction/browserAction.html',
      template: pack.resolve('./src/index.html'),
    },
    {
      chunks: ['optionsUi'],
      filename: 'optionsUi/optionsUi.html',
      template: pack.resolve('./src/index.html'),
    },
    {
      chunks: ['pageAction'],
      filename: 'pageAction/pageAction.html',
      template: pack.resolve('./src/index.html'),
    },
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
