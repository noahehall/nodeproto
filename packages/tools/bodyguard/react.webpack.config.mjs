// @flow

import { buildWebpackConfig, reactWebpackConfig } from '@nodeproto/buildproto';
import { resolve } from '@nodeproto/wtf';
import { throwIt } from '@nodeproto/shared';

import type { ReactDevType, WebpackConfigType, WebpackHtmlOptionsType } from './src/libdefs';

// TODO: eslint/flowtype-errors wags about top level await
(async () => {
  const pathSrc = await resolve('./src');
  const pathDist = await resolve('./dist');

  if (!pathSrc || !pathDist) return throwIt('pathSrc & pathDist need to exist');

  // @see https://webpack.js.org/configuration/entry-context/#entry-descriptor
  const entry ={
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
  };

  const copyOptions = {
    patterns: [
      {
        // @see https://webpack.js.org/plugins/copy-webpack-plugin/#context
        // TODO: plan on deprecating this in favor of webpack5 resolveAssets
        context: pathSrc,
        from: './**/*.(json|png)',
        to: pathDist,
      },
    ],
  };

  const template = `${pathSrc}/index.html`;
  const htmlOptions: WebpackHtmlOptionsType = [
    {
      chunks: ['background'],
      filename: 'background/scriptManager.html',
      template,
    },
    {
      chunks: ['browserAction'],
      filename: 'browserAction/browserAction.html',
      template,
    },
    {
      chunks: ['optionsUi'],
      filename: 'optionsUi/optionsUi.html',
      template,
    },
    {
      chunks: ['sidebarAction'],
      filename: 'sidebarAction/sidebarAction.html',
      template,
    },
  ];

  const reactDevOptions: ReactDevType = {
    cache: false, // TODO: previously had issues with cache, so disabled for now
    copyOptions,
    // $FlowFixMe[incompatible-type]
    entry,
    htmlOptions,
    output: { path: pathDist },
    watch: !!process.env.WATCH, // useful when used with webext:run or whatever
  };

  const webpackArtifacts = await reactWebpackConfig(reactDevOptions);

  buildWebpackConfig(webpackArtifacts.config, true);
})();
