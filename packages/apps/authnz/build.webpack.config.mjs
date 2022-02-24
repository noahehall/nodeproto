// @flow

import { baseWebpackConfig, buildWebpackConfig, testCompiler } from '@nodeproto/buildproto';

const baseWebpackOptions = {
  entry: './src/root.mjs',
  target: 'node-async16.14',
  // NODE_ENV: 'development',
};

(async () => {
  const { config, pack } = await baseWebpackConfig(baseWebpackOptions);

  await buildWebpackConfig(config);
})();
