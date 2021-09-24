import {
  buildWebpackConfig,
  reactDevWebpackConfig,
  setupWebpackConfig,
  } from '@nodeproto/configproto';

import { isMain } from '@nodeproto/wtf/fsproto';

const { pack, config } = setupWebpackConfig();

export const webpackConfig = reactDevWebpackConfig({
  ...config,
  entry: [pack.resolve('./src/root.mjs')],
  htmlOptions: { template: pack.resolve('./src/index.html') },
  output: { path: pack.resolve('./dist') },
  pack,
});

// if this file is run directly, it will build and output to disk
if (isMain(false, import.meta)) buildWebpackConfig(webpackConfig);
