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

// output to disk if this is run directly, and not imported
if (isMain(false, import.meta)) buildWebpackConfig(webpackConfig);
