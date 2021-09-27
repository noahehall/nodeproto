// import { webpackConfig as reactEsbuildWebpackConfig } from './webpack.react.esbuild.config.mjs';
import { serverWebpack as webpackServer } from '@nodeproto/configproto';
import { webpackConfig as reactDevWebpackConfig } from './webpack.react.dev.config.mjs';

import esMain from 'es-main';

// TODO: add cli flags to switch between dev & esbuild configs
// @see https://nodejs.org/api/cli.html#cli_1
// webpackServer(reactEsbuildWebpackConfig);
export const app = webpackServer({
  useConfig: reactDevWebpackConfig,
  pack: {
    writeToDisk: esMain(import.meta) // when run directly, else assume we are in test
  }
});
