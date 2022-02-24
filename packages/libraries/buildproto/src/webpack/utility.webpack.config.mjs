// @flow

// everything should focus on supporting
// http2, longterm caching, parity between dev & prod

import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import json5 from 'json5';
import svgToMiniDataURI from 'mini-svg-data-uri';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import yaml from 'yamljs';

import type {
  BaseWebpackType,
  NodeprotoPackType,
  ObjectType,
  OptimizationOptions,
  OptimizationSplitChunksOptions,
  WebpackConfigType,
  WebpackHtmlOptionsType,
  WebpackInfrastructureLoggingType,
  WebpackOptions,
  WebpackPluginType,
} from '../libdefs';

const cacheGroupBaseParams = {
  chunks: 'all',
  enforce: true, // ignore minSize, minChunks, maxAsyncRequests, maxInitialRequests
  filename: 'js/[name]/bundle.js',
  priority: 1,
  reuseExistingChunk: true,
};

// @see https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups
// a module belonging to multiple groups will be placed in the highest priority
// [\\/] only necessary when supporting windows
// ^ no plans to support windows, plus it messes up my ability to write regex
export const createCacheGroups = (): ObjectType => ({
  babel: {
    ...cacheGroupBaseParams,
    test: /node_modules\/.*babel/,
  },
  default: false, // disable the default cache group
  etc: {
    ...cacheGroupBaseParams,
    test: /node_modules/,
    priority: 0,
  },
  koa: {
    ...cacheGroupBaseParams,
    test: /node_modules\/.*koa/,
  },
  react: {
    ...cacheGroupBaseParams,
    test: /node_modules\/.*react/,
  },
  styles: {
    ...cacheGroupBaseParams,
    test: /node_modules\/.*(animate|normalize|styled|milligram|reakit|react-aria|emotion)/,
  },
});

// @see https://webpack.js.org/plugins/split-chunks-plugin/
// remember we are targeting perf for http2, so more chunks are fine for web
// all numbers are in bytes
// minSize, minSizeReduction,
// enforceSizeThreshold > maxInitialRequest/maxAsyncRequests < maxSize < minSize
// maxSize: before splitting, sets both maxAsyncSize and maxInitialSize
// enforceSizeThreshold: never create a chunk larger than this
export const createSplitChunks = (
  target?: string = 'web',
): OptimizationSplitChunksOptions => {
  const kb = 1_000;
  const mb = 1_000_000;

  const common = {
    automaticNameDelimiter: '-',
    cacheGroups: createCacheGroups(),
    chunks: 'all', // all, async, initial
    hidePathInfo: true,
    minChunks: 1, // shared >= many times among chunks before splitting
    minRemainingSize: kb,
    minSizeReduction: kb, // to the main bundle
    name: false, // false forces the say name across bundles for better caching
    usedExports: true, // enables mangling of export names, and omitting unused
  };

  if (target.includes('node')) return Object.assign({}, common, {
    enforceSizeThreshold: Infinity,
    maxAsyncRequests: Infinity,
    maxInitialRequests: Infinity,
    maxSize: 0, // disable splitting based on size
    minSize: 1,
  });


  return Object.assign({}, common, {
    enforceSizeThreshold: mb * 2,
    maxAsyncRequests: 30, // before splitting to new chunk
    maxInitialRequests: 30, // to the main bundle
    maxSize: mb, // 1mb
    minSize: kb * 10,
  });
};

// slows down dev a bit, but at least it ALMOST mirrors prod
// @see https://webpack.js.org/configuration/optimization/
export const createOptimization = (
  ifProd: boolean,
  pathDist: string,
): OptimizationOptions => ({
  // $FlowFixMe[incompatible-return] webpack 5 typdef doesnt match docs
    chunkIds: ifProd ? 'deterministic' : 'named',
    concatenateModules: true, // depends on usedExports
    emitOnErrors: true, // emit even if errors, will propagate to runtime
    flagIncludedChunks: true,
    innerGraph: true, // required for emotion
    mangleExports: 'deterministic',
    mangleWasmImports: false,
    mergeDuplicateChunks: true,
    minimize: true,
    minimizer: createTerserPlugin({ pathDist, ifProd }),
    // $FlowFixMe[incompatible-return] webpack 5 typdef doesnt match docs
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
  });

// @see https://stackoverflow.com/questions/66343602/use-latest-terser-webpack-plugin-with-webpack5
// @see nhttps://webpack.js.org/configuration/optimization/#optimizationminimizer
// @see https://webpack.js.org/plugins/terser-webpack-plugin/
// @see https://webpack.js.org/plugins/terser-webpack-plugin/#terseroptions
// only works with source-map, inline-source-map, hidden-source-map and nosources-source-map
export const createTerserPlugin = ({
  pathDist,
  ifProd,
}: {
  pathDist: string,
  ifProd: boolean,
}): WebpackPluginType[] => [
    new TerserPlugin({
      extractComments: false, // remove all comments
      minify: TerserPlugin.terserMinify,
      parallel: true,
      terserOptions: {
        format: { comments: false },
        keep_classnames: true,
        mangle: ifProd,
        sourceMap: true,
      },
      test: /\.m?js(\?.*)?$/i,
    }),
  ];


// tests needed pass this line

export const getDefaultPlugins = (copyOptions?: ObjectType, meta: NodeprotoPackType): WebpackPluginType[] =>
  [
    // @see https://github.com/shellscape/webpack-manifest-plugin
    new WebpackManifestPlugin({}),

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
    test: /\.(jpg|jpeg|png|gif)$/,
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

  csvLoader: {
    test: /\.(csv|tsv)$/i,
    use: ['csv-loader'],
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
          // configFile: configFile || './node_modules/@nodeproto/configproto/src/babel/flow.babelrc',
        },
      },
      getStringReplaceLoader(processEnv),
    ],
  },

  // @see https://webpack.js.org/guides/asset-management/#customize-parser-of-json-modules
  jsonLoader: {
    test: /\.json5?$/i,
    type: 'json',
    parser: { parse: json5.parse },
  },

  // @see https://webpack.js.org/guides/asset-management/#customize-parser-of-json-modules
  ymlLoader: {
    test: /\.ya?ml$/i,
    type: 'json',
    parser: { parse: yaml.parse },
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
export const getWebpackExperiments = ({ target }: {
  target: string
}): ObjectType => ({
  // asyncWebAssembly: true, // make a webassembly module an async module
  // buildHttp: false, // build remote resources (security issue)
  // futureDefaults: false,
  // syncWebAssembly: false,
  cacheUnaffected: true,
  layers: true,
  lazyCompilation: false,
  outputModule: true,
  topLevelAwait: true,
});

export const getInfrastructureLogging = (): WebpackInfrastructureLoggingType => ({
  // TODO:
  // @see https://webpack.js.org/configuration/other-options/#infrastructurelogging
  level: 'info',
});

export const combineArrays = (baseArray: any[], startArray: any[], endArray: any[]): any[] => startArray.concat(baseArray, endArray);

export const getHtmlWebpackPlugin = (
  htmlOptions: WebpackHtmlOptionsType = {}
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

// TODO: where are we using this?
// @see getDefaultPlugins ?
export const generateBasePlugins = (
  htmlOptions: WebpackHtmlOptionsType = {},
  pluginsPush: WebpackPluginType[] = []
): WebpackPluginType[] => getHtmlWebpackPlugin(htmlOptions).concat(
  new webpack.HotModuleReplacementPlugin(),
  pluginsPush
).filter(Boolean);
