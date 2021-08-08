import { envproto } from '@nodeproto/utils';
import path from 'path';
import wtf from '@nodeproto/wtf';
import os from 'os';

const pkgJson = wtf.fs.readJsonSync('./package.json');

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
const terserPlugin = [
  () => ({
    test: /\.(m|c)+js$/i,
    include: [pkgJson.directories.app],
    extractComments: false,
    parallel: (os.cpus().length - 1) || 1,

    // @see https://github.com/terser/terser#minify-options
    terserOptions: {
      format: { comments: false },
      keep_classnames: true,
      mangle: ifProd,
      module: false, // TODO: when enabling module + nomodule output
      toplevel: false,
    },
  })
];

const minSize = 20000;
const maxSize = minSize * 6;
const vendors = {
  chunks: 'all',
  enforce: true,
  filename: 'js/[name]/bundle.js',
  reuseExistingChunk: true,
}
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
      test: /[\\/]node_modules[\\/](reakit|react\-aria|\@reach).*[\\/]/,
    },
    babel: {
      ...vendors,
      idHint: '3',
      priority: -8,
      test: /[\\/]node_modules[\\/].*babel.*[\\/]/,
    },
    react: {
      ...vendors,
      idHint: '4',
      priority: -9,
      test: /[\\/]node_modules[\\/].*react.*[\\/]/,
    },
    etc: {
      ...vendors,
      idHint: '5',
      priority: -10,
      test: /[\\/]node_modules[\\/]/,
    },
    default: {
      idHint: '6',
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
