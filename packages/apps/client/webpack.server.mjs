import { serverWebpack as webpackServer } from '@nodeproto/buildproto';
import { webpackConfig } from './webpack.dev.config.mjs';

export const app = webpackServer({
  useConfig: webpackConfig,
  pack: {
    writeToDisk: true
  }
});
