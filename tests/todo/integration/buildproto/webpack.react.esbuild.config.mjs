import {
  buildWebpackConfig,
  reactEsbuildWebpackConfig,
  setupWebpackConfig,
} from '@nodeproto/configproto';

import esMain from 'es-main';

const {
  config,
  pack,
} = setupWebpackConfig();

export const webpackConfig = reactEsbuildWebpackConfig({
  entry: pack.resolve('./copypasta/react/helloworld/index.jsx'),
  htmlOptions: { template: pack.resolve('./copypasta/react/helloworld/index.html') },
  outputDir: pack.resolve('./dist/cjs/copypasta/react/esbuild'),
  pack,
  ...config,
});

if (esMain(import.meta)) buildWebpackConfig(webpackConfig);
