// @flow

import { throwIt } from '@nodeproto/shared';

import {
  combineArrays,
  createOptimization,
  generateLoaders,
  getCache,
  getDefaultPlugins,
  getInfrastructureLogging,
  getWebpackExperiments,
} from './utility.webpack.config';

import { pack } from '../pack';

import type {
  BaseWebpackType,
  NodeprotoPackType,
  WebpackConfigType,
} from '../libdefs';

// everything here affects the output of webpack and not webpack itself
export const baseWebpackConfig = async ({
  cache = false,
  configFile = false,
  context,
  copyOptions,
  entry,
  entryPush = [],
  entryUnshift = [],
  NODE_ENV,
  PATH_DIST,
  PATH_SRC,
  pluginsPush = [],
  pluginsUnshift = [],
  processEnv = {},
  writeToDisk = false,
  ...rest
}: BaseWebpackType ): Promise<{
  config: WebpackConfigType,
  pack: NodeprotoPackType
}> => {
  if (!entry) throwIt('entry must be defined');

  const meta = await pack({ context, NODE_ENV, PATH_DIST, PATH_SRC });

  const baseWebpackConfig = Object.assign(
    {},
    {
      cache: getCache(cache, meta),
      context: meta.context,
      devtool: meta.ifProd ? 'hidden-source-map' : 'eval-source-map',
      entry: Array.isArray(entry)
        ? combineArrays(entry, entryUnshift, entryPush).filter(Boolean)
        : entry,
      experiments: getWebpackExperiments(),
      externals: meta.builtinModules,
      infrastructureLogging: getInfrastructureLogging(),
      mode: meta.NODE_ENV,
      module: {
        rules: generateLoaders({ processEnv, configFile, }),
      },
      optimization: createOptimization(meta.ifProd, meta.pathDist), //
      output: {
        charset: true,
        chunkFilename: '[name].chunk.js',
        clean: false, // just do this manually
        compareBeforeEmit: true, // dont emit files if the file already exists with same content
        filename: '[name].js',
        path: meta.pathDist,
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
      stats: 'normal',
      target: 'web',
    },
    rest
  );

  return Object.freeze({ config: baseWebpackConfig, pack: meta });
};
