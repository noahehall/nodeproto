// @flow strict-local
// use flow strict for all mission critical services
// or at the minimum use strict-local
// @see https://flow.org/en/docs/strict/

import { webpackServer } from '@nodeproto/buildproto';

import { getWebpackConfig } from './webpack.dev.config.mjs';

(async () => {
  const { config, pack } = await getWebpackConfig();
  const app = webpackServer({ config, pack });
})();
