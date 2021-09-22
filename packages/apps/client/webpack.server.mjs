import { serverWebpack as webpackServer } from '@nodeproto/configproto';
import { webpackConfig } from './webpack.dev.config.mjs';

export const app = webpackServer({
  useConfig: webpackConfig,
  pack: {
    writeToDisk: true
  }
});
