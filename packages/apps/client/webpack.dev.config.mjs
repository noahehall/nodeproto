import {
  buildWebpackConfig,
  reactDevWebpackConfig,
  setupWebpackConfig,
  } from '@nodeproto/buildproto';

import { dirs, isMain } from '@nodeproto/wtf';

const { pack, config } = setupWebpackConfig();

export const webpackConfig = reactDevWebpackConfig({
  ...config,
  entry: [pack.resolve('./src/root.mjs')],
  htmlOptions: { template: pack.resolve('./src/index.html') },
  output: { path: pack.resolve('./dist') },
  pack,
});

// if this file is run directly, it will build and output to disk
if (isMain(dirs.isEsm() ? import.meta : require.main)) buildWebpackConfig(webpackConfig);
