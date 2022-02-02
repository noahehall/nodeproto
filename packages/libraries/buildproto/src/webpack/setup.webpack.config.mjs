// @flow

import { builtinModules } from 'module';
import { readFileSync } from 'fs';

import os from 'os';
import path from 'path';

import type { ObjectType, WebpackSetupType } from '../../libdefs';

const createCacheGroups = (vendors: ObjectType): ObjectType => ({
  babel: {
    ...vendors,
    idHint: '3',
    priority: -8,
    test: /[\\/]node_modules[\\/].*babel.*[\\/]/,
  },
  default: {
    idHint: '6',
    minChunks: 2,
    priority: -20,
    reuseExistingChunk: true,
  },
  etc: {
    ...vendors,
    idHint: '5',
    priority: -10,
    test: /[\\/]node_modules[\\/]/,
  },
  react: {
    ...vendors,
    idHint: '4',
    priority: -9,
    test: /[\\/]node_modules[\\/].*react.*[\\/]/,
  },
  styled: {
    ...vendors,
    idHint: '1',
    priority: -6,
    test: /[\\/]node_modules[\\/](animate|normalize|styled|milligram).*[\\/]/,
  },
  support: {
    ...vendors,
    idHint: '2',
    priority: -7,
    test: /[\\/]node_modules[\\/](reakit|react-aria|@reach).*[\\/]/,
  },
});

export const setupWebpack = ({
  context = process.cwd(),
  IS_DEV = false,
  IS_PROD = false,
  NODE_ENV = 'development',
  PATH_DIST = '',
  PATH_SRC = '',
  pkgJsonPath = './package.json',

  ...rest
}: WebpackSetupType): { config: ObjectType, pack: ObjectType } => {
  const resolve = (filepath: string, parent: string = context): string => path.resolve(filepath, parent);

  const getFile = (filepath: string): string => readFileSync(resolve(filepath, context), 'utf8');

  const pkgJson: ObjectType = JSON.parse(getFile(pkgJsonPath));
  const pathDist: string = resolve(PATH_DIST || pkgJson.config.PATH_DIST);
  const pathSrc: string = resolve(PATH_SRC || pkgJson.config.PATH_SRC);
  const mode: string = NODE_ENV || pkgJson.config.NODE_ENV;
  const ifProd: boolean = IS_PROD || mode === 'production';
  const ifDev: boolean = IS_DEV || !ifProd;

  // @see https://stackoverflow.com/questions/66343602/use-latest-terser-webpack-plugin-with-webpack5
  const terserPlugin = [
    () => ({
      extractComments: false,
      include: [pathDist],
      parallel: os.cpus().length - 1 || 1,
      // @see https://github.com/terser/terser#minify-options
      terserOptions: {
        format: { comments: false },
        keep_classnames: true,
        mangle: ifProd,
        module: false, // TODO: when enabling module + nomodule output
        toplevel: false,
      },
      test: /\.(m|c)+js$/i,
    }),
  ];

  const minSize: number = 20000;
  const maxSize: number = minSize * 6;
  const vendors = {
    chunks: 'all',
    enforce: true,
    filename: 'js/[name]/bundle.js',
    reuseExistingChunk: true,
  };

  // @see https://webpack.js.org/plugins/split-chunks-plugin/
  const splitChunks = {
    cacheGroups: createCacheGroups(vendors),
    chunks: 'all',
    enforceSizeThreshold: 50000,
    maxAsyncRequests: 30,
    maxAsyncSize: maxSize,
    maxInitialRequests: 30,
    maxInitialSize: maxSize,
    maxSize,
    minChunks: 1,
    minRemainingSize: minSize, // to mirror prod
    minSize,
    name: false,
    usedExports: false, // TODO
  };

  // slows down dev a bit, but at least it ALMOST mirrors prod
  // @see https://webpack.js.org/configuration/optimization/
  const optimization = {
    chunkIds: ifProd ? 'deterministic' : 'named',
    concatenateModules: false, // depends on usedExports
    emitOnErrors: true, // emit assets even if there are errors
    flagIncludedChunks: true,
    innerGraph: true, // required for emotion
    mangleExports: false,
    mergeDuplicateChunks: true,
    minimize: ifProd,
    minimizer: ifProd ? terserPlugin : undefined,
    moduleIds: ifProd ? 'deterministic' : 'named',
    nodeEnv: mode,
    portableRecords: true,
    providedExports: true,
    realContentHash: true,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: 'single', // all entry points runtime in the same file
    sideEffects: true,
    splitChunks,
    usedExports: false, // cant be used with experiments.cacheUnaffected
    // mangleWasmImports // TODO
  };

  return {
    config: {
      ...rest,
      context,
      mode,
      optimization,
    },

    pack: {
      builtinModules,
      getFile,
      ifDev,
      ifProd,
      pathDist,
      pathSrc,
      pkgJson,
      resolve,
    },
  };
};
