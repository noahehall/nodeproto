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
  ObjectType,
  WebpackConfigType,
} from '../libdefs';

// @see https://webpack.js.org/configuration/output/
export const getWebpackOutput = ({ meta, target }: {
  meta: NodeprotoPackType,
  target: string,
}): ObjectType => {
  const common = {
      // path: meta.pathDist,
      // trustedTypes: false, // todo, requires CSP spike
      asyncChunks: true,
      chunkFilename: '[name].chunk.js', // ondemand chunks
      clean: true,
      compareBeforeEmit: true, // only emit changed files
      filename: '[name].js', //initial chunks
      pathinfo: false,
      strictModuleErrorHandling: false, // perf hit if true
  };

  if (target.includes('node')) return Object.assign({}, common, {
      chunkLoading: 'async-node',
      chunkFormat: 'module',
      module: true,
    }
  );

  return Object.assign({}, common, {
    charset: true,
    chunkFormat: 'module',
    module: true, // requires experiments.outputModule
    publicPath: 'auto', // @see https://webpack.js.org/guides/public-path/#automatic-publicpath
  });
};
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
  target = 'browserslist',
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
      // TODO: NONE of these json docs should be typed mixed/objectyped/etc
      cache: getCache(cache, meta),
      context: meta.context,
      devtool: meta.ifProd ? 'hidden-source-map' : 'source-map',
      entry: Array.isArray(entry)
        ? combineArrays(entry, entryUnshift, entryPush).filter(Boolean)
        : entry,
      experiments: getWebpackExperiments({ target }),
      externals: meta.builtinModules,
      externalsType: target.includes('node') ? 'node-commonjs' : 'import',
      infrastructureLogging: getInfrastructureLogging(),
      mode: meta.NODE_ENV,
      module: {
        rules: generateLoaders({ processEnv, configFile, }),
      },
      optimization: createOptimization(meta.ifProd, meta.pathDist), //
      output: getWebpackOutput({ meta, target }),
      plugins: combineArrays(
        getDefaultPlugins(copyOptions, meta),
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
