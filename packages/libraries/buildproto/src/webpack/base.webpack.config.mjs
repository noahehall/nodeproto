// @flow

import { throwIt } from '@nodeproto/shared';

import {
  combineArrays,
  generateLoaders,
  getCache,
  getDefaultPlugins,
} from './utility.webpack.config';

import { setupWebpackConfig } from './setup.webpack.config';

import type {
  BaseWebpackType,
  NodeprotoPackType,
  WebpackConfigType,
  WebpackOptions,
} from '../libdefs';

// everything here affects the output of webpack and not webpack itself
export const baseWebpackConfig = async ({
  cache = false,
  configFile = false,
  context = process.cwd(),
  copyOptions,
  entry,
  entryPush = [],
  entryUnshift = [],
  NODE_ENV = 'development',
  pluginsPush = [],
  pluginsUnshift = [],
  processEnv = {},

  ...rest
}: BaseWebpackType ): Promise<{
  config: WebpackConfigType,
  pack: NodeprotoPackType
}> => {
  if (!entry) throwIt('entry must be defined');

  const { config, pack } = await setupWebpackConfig({ context, NODE_ENV });

  return {
    config: Object.assign(
      {},
      config,
      {
        cache: getCache(cache, pack),
        context,
        devtool: pack.ifProd ? 'hidden-source-map' : 'eval-source-map',
        entry: Array.isArray(entry)
          ? combineArrays(entry, entryUnshift, entryPush).filter(Boolean)
          : entry,
        externals: pack.builtinModules,
        module: {
          rules: generateLoaders({ processEnv, configFile, }),
        },
        output: {
          charset: true,
          chunkFilename: '[name].chunk.js',
          clean: false, // just do this manually
          compareBeforeEmit: true, // dont emit files if the file already exists with same content
          filename: '[name].js',
          path: pack.pathDist,
          publicPath: 'auto', // @see https://webpack.js.org/guides/public-path/#automatic-publicpath
        },
        plugins: combineArrays(
          getDefaultPlugins(copyOptions),
          pluginsUnshift,
          pluginsPush
        ).filter(Boolean),
        resolve: {
          extensions: ['.mjs', '.js', '.json', '.cjs'],
          mainFields: ['module', 'main'],
        },
        stats: 'summary',
        target: 'web',
      },
      rest
    ),
    pack,
  };
};
