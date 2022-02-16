// @flow

import { reactWebpackConfig, webpackBuild } from '@nodeproto/buildproto';
import { resolve } from '@nodeproto/wtf';

import type { ReactDevType, WebpackConfigType } from './src/libdefs';

const pathSrc = await resolve('./src');
const pathDist = await resolve('./dist');

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
        // @see https://webpack.js.org/plugins/copy-webpack-plugin/#context
        // TODO: plan on deprecating this in favor of webpack5 resolveAssets
        context: pathSrc,
        from: './**/*.(json|png)',
        to: pathDist,
      },
    ],
  },
  htmlOptions: [
    {
      chunks: ['background'],
      filename: 'background/scriptManager.html',
      template: `${pathSrc}/index.html`,
    },
    {
      chunks: ['browserAction'],
      filename: 'browserAction/browserAction.html',
      template: `${pathSrc}/index.html`,
    },
    {
      chunks: ['optionsUi'],
      filename: 'optionsUi/optionsUi.html',
      template: `${pathSrc}/index.html`,
    },
    {
      chunks: ['sidebarAction'],
      filename: 'sidebarAction/sidebarAction.html',
      template: `${pathSrc}/index.html`,
    },
  ],
  output: { path: pathDist },
};

const webpackArtifacts = await reactWebpackConfig(reactDevOptions);

webpackBuild(webpackArtifacts.config, true);
