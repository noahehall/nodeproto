// @flow

import {
  generateLoaders,
  getCache,
  getDefaultPlugins,
} from './utility.webpack.config';

import { setupWebpackConfig } from './setup.webpack.config';

import type {
  BaseWebpackType,
  WebpackConfigType,
  WebpackOptions,
} from '../../libdefs';


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
  processEnv = {},

  ...rest
}: BaseWebpackType ): Promise<WebpackConfigType> => {
  const { config, pack } = await setupWebpackConfig({ context, NODE_ENV });

  return Object.assign(
    {},
    config,
    {
      cache: getCache(cache, pack),
      context,
      devtool: pack.ifProd ? 'hidden-source-map' : 'eval-source-map',
      entry: Array.isArray(entry) ? entryUnshift.concat(entry, entryPush).filter(Boolean) : entry,
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
      plugins: getDefaultPlugins(copyOptions),
      resolve: {
        extensions: ['.mjs', '.js', '.json', '.cjs'],
        mainFields: ['module', 'main'],
      },
      stats: 'summary',
      target: 'web',
    },
    rest
  );
};
