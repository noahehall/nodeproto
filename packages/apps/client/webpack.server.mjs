import { serverWebpack as webpackServer } from '@nodeproto/configproto';
import { webpackConfig } from './webpack.dev.mjs';

export const app = webpackServer({
  useConfig: webpackConfig,
  pack: {
    writeToDisk: true
  }
});
