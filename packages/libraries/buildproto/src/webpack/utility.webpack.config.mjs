// @flow

// TODO: file is wayy tooo long
import os from 'os';

import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import svgToMiniDataURI from 'mini-svg-data-uri';
import webpack from 'webpack';

import type {
  BaseWebpackType,
  NodeprotoPackType,
  ObjectType,
  OptimizationOptions,
  WebpackConfigType,
  WebpackOptions,
  WebpackPluginType,
} from '../../libdefs';

const cacheGroupBaseParams = {
  chunks: 'all',
  enforce: true,
  filename: 'js/[name]/bundle.js',
  reuseExistingChunk: true,
};

export const createCacheGroups = (): ObjectType => ({
  babel: {
    ...cacheGroupBaseParams,
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
    ...cacheGroupBaseParams,
    idHint: '5',
    priority: -10,
    test: /[\\/]node_modules[\\/]/,
  },
  react: {
    ...cacheGroupBaseParams,
    idHint: '4',
    priority: -9,
    test: /[\\/]node_modules[\\/].*react.*[\\/]/,
  },
  styled: {
    ...cacheGroupBaseParams,
    idHint: '1',
    priority: -6,
    test: /[\\/]node_modules[\\/](animate|normalize|styled|milligram).*[\\/]/,
  },
  support: {
    ...cacheGroupBaseParams,
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


// tests needed pass this line

export const getDefaultPlugins = (copyOptions?: ObjectType): WebpackPluginType[] =>
  [
    // @see https://github.com/relative-ci/bundle-stats/tree/master/packages/webpack-plugin
    new BundleStatsWebpackPlugin({
      baseline: false,
      compare: false,
      html: true,
      json: false,
      outDir: '../bundlestats',
      silent: false,
    }),

    // @see https://stackoverflow.com/questions/49852038/copy-files-with-copywebpackplugin
    copyOptions && new CopyPlugin(copyOptions),
  ].filter(Boolean);

// @see https://webpack.js.org/guides/asset-modules/
// @see https://webpack.js.org/configuration/output/#template-strings
// asset/resource: emit separate file (e.g. file-loader)
// asset/inline: export data uri (e.g. url-loader)
// asset/source: export source code (e.g. raw-loader)
// asset: automatically choose (e.g. url-loader with asset size limit)
export const getAssetLoaders = (): ObjectType => ({
  fontLoader: {
    test: /\.(eot|otf|ttf|woff|woff2)$/,
    type: 'asset/resource',
    generator: { filename: '[file][query]' },
  },
  imageLoader: {
    test: /\.(jpg|png|gif)$/,
    type: 'asset/resource',
    generator: { filename: '[file][query]' },
  },
  svgLoader: {
    test: /\.svg$/,
    type: 'asset/inline',
    generator: {
      filename: '[file][query]',
      dataUrl: (content) => svgToMiniDataURI(content.toString()),
    },
  },
  videoLoader: {
    test: /\.(mp4|webm)$/,
    type: 'asset/resource',
    generator: { filename: '[file][query]' },
  },
});

export const generateLoaders = ({ processEnv = {}, configFile }: {
  configFile: boolean | string,
  processEnv: ObjectType,
} = {}): any[] => Object.values({
  ...getAssetLoaders(),
  cssExternalLoader: {
    test: /\.css$/,
    include: /node_modules/,
    use: ['style-loader', 'css-loader'],
  },

  cssInternalLoader: {
    test: /\.css$/,
    exclude: /node_modules/,
    use: ['style-loader', 'css-loader'],
  },

  // @see https://github.com/webpack/webpack/issues/11467
  esmLoader: {
    test: /\.m?js$/,
    type: 'javascript/auto',
    // include: /node_modules/,
    resolve: { fullySpecified: false },
  },

  jsLoader: {
    exclude: /node_modules/,
    // be careful if you do this
    // you will be hunting for a bug wondering why some files are throwing errors
    // instead of being compiled if you import a file outside of the pathSrc
    // include: [pathSrc],
    test: /\.(c|m)?jsx?$/,
    type: 'javascript/auto',
    use: [
      {
        loader: 'babel-loader',
        options: {
          sourceType: 'unambiguous',
          configFile: configFile || './node_modules/@nodeproto/configproto/src/babel/flow.babelrc',
        },
      },
      getStringReplaceLoader(processEnv),
    ],
  },
}).filter(Boolean);

// @see https://webpack.js.org/configuration/cache/
export const getCache = (
  cache: boolean | ObjectType,
  pack: NodeprotoPackType,
): boolean | ObjectType => {
  return !cache // disable|production
    ? false
    : typeof cache === 'boolean' // use our defaults for devlepoment|production
    ? {
        // TODO: should return settings appropriate for prod if mode === 'production'

        // options only for type:memory
        // maxGenerations: 10
        // cacheUnaffected: true,

        // enabled for development
        // cacheDirectory: 'node_modules/.cache/webpack', // use webpack defualts
        // cacheLocation: 'name_of_app', // use webpack default
        allowCollectingMemory: true,
        // buildDependencies: { config: ['webpack/lib', pack.pathSrc] },
        compression: false,
        hashAlgorithm: 'md4',
        idleTimeout: 60000,
        idleTimeoutAfterLargeChanges: 1000,
        idleTimeoutForInitialStore: 0,
        maxAge: 5184000000 / 4, // 7 days
        maxMemoryGenerations: 10,
        memoryCacheUnaffected: true,
        name: pack.pkgJson.name,
        profile: true,
        store: 'pack',
        type: 'filesystem',
        version: pack.pkgJson.version,
      }
    : cache; // use whatever they send
};

export const getStringReplaceLoader = (processEnv: ObjectType): ObjectType => ({
    loader: 'string-replace-loader', // we use this instead of dotenv-webpack
    options: {
      multiple: Object.entries(processEnv).map(([search, replace]) => ({
        search,
        replace,
      })),
    },
  });

// @see https://webpack.js.org/configuration/experiments/#root
export const getWebpackExperiments = (): ObjectType => ({
  // futureDefaults: false,
  asyncWebAssembly: true, // make a webassembly module an async module
  // buildHttp: false, // build remote resources (security issue)
  cacheUnaffected: true,
  layers: true,
  lazyCompilation: false,
  outputModule: false,
  syncWebAssembly: false,
  topLevelAwait: true,
});

export const getInfrastructureLogging = (): ObjectType => ({
  // TODO:
  // @see https://webpack.js.org/configuration/other-options/#infrastructurelogging
  level: 'info',
});

export const combineArrays = (baseArray: any[], startArray: any[], endArray: any[]): any[] => startArray.concat(baseArray, endArray);

export const getHtmlWebpackPlugin = (
  htmlOptions: ObjectType | ObjectType[] = {}
): WebpackPluginType[] => {
  if (Array.isArray(htmlOptions))
    return htmlOptions.map(
      ({ inject = true, ...rest }) =>
        new HtmlWebpackPlugin({
          ...rest,
          inject, // Inject all files that are generated by webpack, e.g. bundle.js
        })
    );

  const { inject = true, ...rest } = htmlOptions;

  return [
    new HtmlWebpackPlugin({ ...rest, inject }),
  ];
};

export const generateBasePlugins = (
  htmlOptions: ObjectType = {},
  pluginsPush: WebpackPluginType[] = []
): WebpackPluginType[] => getHtmlWebpackPlugin(htmlOptions).concat(
  new webpack.HotModuleReplacementPlugin(),
  pluginsPush
).filter(Boolean);
