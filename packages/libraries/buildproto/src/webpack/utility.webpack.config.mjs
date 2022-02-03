// @flow
import os from 'os';

import type {
  ObjectType,
  OptimizationOptions,
} from '../../libdefs';

const vendors = {
  chunks: 'all',
  enforce: true,
  filename: 'js/[name]/bundle.js',
  reuseExistingChunk: true,
};

export const createCacheGroups = (): ObjectType => ({
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

// @see https://webpack.js.org/plugins/split-chunks-plugin/
export const createSplitChunks = (
  minSize?: number = 2000
): ObjectType => {
  const maxSize: number = minSize * 6;

  return {
    cacheGroups: createCacheGroups(),
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
};

// slows down dev a bit, but at least it ALMOST mirrors prod
// @see https://webpack.js.org/configuration/optimization/
export const createOptimization = (
  ifProd: boolean,
  pathDist: string,
): OptimizationOptions => ({
    // $FlowFixMe[incompatible-return]
    chunkIds: ifProd ? 'deterministic' : 'named',
    concatenateModules: false, // depends on usedExports
    emitOnErrors: true, // emit assets even if there are errors
    flagIncludedChunks: true,
    innerGraph: true, // required for emotion
    mangleExports: false,
    mergeDuplicateChunks: true,
    minimize: ifProd,
    minimizer: ifProd ? createTerserPlugin(pathDist, ifProd) : undefined,
    // $FlowFixMe[incompatible-return]
    moduleIds: ifProd ? 'deterministic' : 'named',
    nodeEnv: ifProd ? 'production' : 'development',
    portableRecords: true,
    providedExports: true,
    realContentHash: true,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: 'single', // all entry points runtime in the same file
    sideEffects: true,
    splitChunks: createSplitChunks(),
    usedExports: false, // cant be used with experiments.cacheUnaffected
    // mangleWasmImports // TODO
  });

// @see https://stackoverflow.com/questions/66343602/use-latest-terser-webpack-plugin-with-webpack5
export const createTerserPlugin = (
  pathDist: string,
  ifProd: boolean
): Function[] => [
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
