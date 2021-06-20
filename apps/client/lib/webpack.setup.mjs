import { envproto } from '@nodeproto/utils';
import path from 'path';
import pkgJson from '../package.json';
import os from 'os';

export { builtinModules } from 'module';
export { default as babelConfigDefault } from './babel.config.cjs';

export const context = process.cwd();
export const env = envproto.syncEnvAndConfig(pkgJson);
export const pathDist = path.resolve(context, env.directories.dist);
export const pathSrc = path.resolve(context, env.directories.app);

export const mode = env.config.NODE_ENV;
export const ifDev = mode === 'development';
export const ifProd = mode === 'production';

const prefix = 'error in pack:';
export const throwMsg = msg => { throw new Error(`${prefix} ${msg}`); };

// @see https://stackoverflow.com/questions/66343602/use-latest-terser-webpack-plugin-with-webpack5
const terserPlugin = () => ({
  test: /\.+(m|c)js$/i,
  include: [pkgJson.directories.app],
  parallel: (os.cpus().length - 1 ) || 1,

  // @see https://github.com/terser/terser#minify-options
  terserOptions: {
    mangle: ifProd,
    module: false, // TODO: when enabling module + nomodule output
    toplevel: false,
    keep_classnames: true,
  },
});

const minSize = 20000;
const maxSize = minSize * 6;
const splitChunks = {
  chunks: 'all',
  enforceSizeThreshold: 50000,
  maxAsyncRequests: 30,
  maxInitialRequests: 30,
  maxAsyncSize: maxSize,
  maxInitialSize: maxSize,
  maxSize,
  minChunks: 1,
  name: false,
  usedExports: true,
  minRemainingSize: minSize, // to mirror prod
  minSize,

  cacheGroups: {
    defaultVendors: {
      filename: 'js/[name]/bundle.js',
      idHint: 'ext',
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      reuseExistingChunk: true,
      enforce: true,
      chunks: 'all',
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true,
    },
  },
};

// slows down dev a bit, but at least it ALMOST mirrors prod
// @see https://webpack.js.org/configuration/optimization/
export const optimization = {
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
  providedExports: true,
  realContentHash: ifProd,
  removeAvailableModules: true,
  removeEmptyChunks: true,
  runtimeChunk: { name: 'runtime' },
  sideEffects: true,
  splitChunks,
  usedExports: true,
}
