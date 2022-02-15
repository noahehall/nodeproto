// @flow strict-local

import { reactWebpackConfig } from '@nodeproto/buildproto';

import type {
  NodeprotoPackType,
  WebpackConfigType,
} from './src/libdefs';

export const getWebpackConfig = async (): Promise<{
  config: WebpackConfigType, pack: NodeprotoPackType
}> => {
  return reactWebpackConfig({
    entry: ['./src/root.mjs'],
    htmlOptions: { template: './src/index.html' },
  });
};

// run this file directly to output to disk
// TODO: buildwebpack needs rework
// if (isMain(dirs.isEsm() ? import.meta : require.main)) buildWebpackConfig(webpackConfig);
