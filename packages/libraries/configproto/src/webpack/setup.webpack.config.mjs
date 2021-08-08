/**
  * @nodeproto/configproto setup webpack config
  * generates data & fns suitable for generating a webpack config
  * generally you want to send this into base.webpack.config.mjs
  */

import { builtinModules } from 'module';
import { readFileSync } from 'fs';

import os from 'os';
import path from 'path';


const throwMsg = (
  msg,
  prefix = 'error in setup.webpack.config: '
) => { throw new Error(`${prefix}${msg}`); };

const createCacheGroups = vendors => ({
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


export default function setupWebpack({
  context = process.cwd(),
  IS_DEV = false,
  IS_PROD = false,
  NODE_ENV = 'development',
  PATH_DIST = '',
  PATH_SRC = '',
  pkgJsonPath = './package.json',

  ...overrides
} = {}) {
  const r = (f = throwMsg('cant find file', 'error in webpack/setup.webpack.config.mjs.r: '), c = context) => path.resolve(c, f);

  const getFile = (
    f = throwMsg('pathOnDisk', 'error in webpack/setup.webpack.config.mjs.getFile: '),
  ) => readFileSync(r(f, context), 'utf8');

  const pkgJson = JSON.parse(getFile(pkgJsonPath));
  const pathDist = r(PATH_DIST || pkgJson.config.PATH_DIST);
  const pathSrc = r(PATH_SRC || pkgJson.config.PATH_SRC);
  const mode = NODE_ENV || pkgJson.config.NODE_ENV;
  const ifProd = IS_PROD || mode === 'production';
  const ifDev = IS_DEV || !ifProd;

  // @see https://stackoverflow.com/questions/66343602/use-latest-terser-webpack-plugin-with-webpack5
  const terserPlugin = [
    () => ({
      extractComments: false,
      include: [pathDist],
      parallel: (os.cpus().length - 1) || 1,
      // @see https://github.com/terser/terser#minify-options
      terserOptions: {
        format: { comments: false },
        keep_classnames: true,
        mangle: ifProd,
        module: false, // TODO: when enabling module + nomodule output
        toplevel: false,
      },
      test: /\.(m|c)+js$/i,
    })
  ];

  const minSize = 20000;
  const maxSize = minSize * 6;
  const vendors = {
    chunks: 'all',
    enforce: true,
    filename: 'js/[name]/bundle.js',
    reuseExistingChunk: true,
  };

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
    usedExports: true,
  };

  // slows down dev a bit, but at least it ALMOST mirrors prod
// @see https://webpack.js.org/configuration/optimization/
  const optimization = {
    chunkIds: ifProd ? 'deterministic' : 'named',
    concatenateModules: true,
    emitOnErrors: true, // useful if we need to debug
    flagIncludedChunks: true,
    innerGraph: true,
    mangleExports: ifProd,
    mergeDuplicateChunks: true,
    minimize: ifProd,
    minimizer: ifProd ? terserPlugin : undefined,
    moduleIds: ifProd ? 'deterministic' : 'named',
    nodeEnv: mode,
    portableRecords: true,
    providedExports: true,
    realContentHash: ifProd,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    runtimeChunk: { name: 'runtime' },
    sideEffects: true,
    splitChunks,
    usedExports: true,
  };

  return {
    config: {
      context,
      mode,
      optimization,
      ...overrides
    },

    pack: {
      builtinModules,
      getFile,
      ifDev,
      ifProd,
      pathDist,
      pathSrc,
      pkgJson,
      resolve: r,
    },

  };
}
