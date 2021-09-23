import {
  buildWebpackConfig,
  reactDevWebpackConfig,
  setupWebpackConfig,
  } from '@nodeproto/configproto';

import esMain from 'es-main';

const { pack, config } = setupWebpackConfig();

const ext = ['jsx', 'mjs', 'js'];

export const webpackConfig = reactDevWebpackConfig({
  entry: [pack.resolve('./copypasta/react/helloworld/index.' + ext[2])],
  htmlOptions: { template: pack.resolve('./copypasta/react/helloworld/index.html') },
  output: { path: pack.resolve('./dist/cjs/copypasta/react/dev') },
  pack,
  ...config,
});

if (esMain(import.meta)) buildWebpackConfig(webpackConfig);
