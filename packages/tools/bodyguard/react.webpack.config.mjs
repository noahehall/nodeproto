// @flow

import { reactWebpackConfig } from '@nodeproto/buildproto';
import { resolve } from '@nodproto/wtf';

import type { ReactDevType, WebpackConfigType } from './src/libdefs';

const reactDevOptions: ReactDevType = {
  watch: process.env.WATCH == 1,
  cache: false, // TODO: previously had issues with cache, so disabled for now
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
    sidebarAction: {
      filename: 'sidebarAction/sidebarAction.js',
      import: './src/sidebarAction/sidebarAction.mjs',
    },
  },
  copyOptions: {
    patterns: [
      {
        context: resolve('./src'),
        from: './**/*.(json|png)', // TODO: shouldnt need png anymore as its handled via resolveAssets webpack5 thing?
      },
    ],
  },
  htmlOptions: [
    {
      chunks: ['background'],
      filename: 'background/scriptManager.html',
      template: resolve('./src/index.html'),
    },
    {
      chunks: ['browserAction'],
      filename: 'browserAction/browserAction.html',
      template: resolve('./src/index.html'),
    },
    {
      chunks: ['optionsUi'],
      filename: 'optionsUi/optionsUi.html',
      template: resolve('./src/index.html'),
    },
    // {
    //   chunks: ['pageAction'],
    //   filename: 'pageAction/pageAction.html',
    //   template: pack.resolve('./src/index.html'),
    // },
    {
      chunks: ['sidebarAction'],
      filename: 'sidebarAction/sidebarAction.html',
      template: resolve('./src/index.html'),
    },
  ],
  output: { path: resolve('./dist') },
};

export const webpackConfig: WebpackConfigType = (await reactWebpackConfig(reactDevOptions)).config;
