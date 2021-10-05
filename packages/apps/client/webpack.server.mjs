// @flow strict

import { serverWebpack as webpackServer } from '@nodeproto/buildproto';
import { webpackConfig } from './webpack.dev.config.mjs';

export type WebpackServer = {
  useConfig: {...},
  pack: {...}
};

export const app: WebpackServer = webpackServer({
  useConfig: webpackConfig,
  pack: {
    writeToDisk: true
  }
});
