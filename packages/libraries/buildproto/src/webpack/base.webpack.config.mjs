// @flow

// @see https://webpack.js.org/plugins/copy-webpack-plugin/
import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import svgToMiniDataURI from 'mini-svg-data-uri';

import type {
  NodeprotoPackType,
  ObjectType,
  WebpackConfigType,
  WebpackPluginType,
  WebpackSetupType,
} from '../../libdefs';

export const getDefaultPlugins = ({ copyOptions }: ObjectType ): WebpackPluginType[] =>
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

    copyOptions && new CopyPlugin(copyOptions),
  ].filter((x) => x);

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

export const generateLoaders = ({ stringReplaceLoader, configFile }: {
  stringReplaceLoader: ObjectType,
  configFile: boolean | string,
}): ObjectType => ({
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
      stringReplaceLoader,
    ],
  },
});

// @see https://webpack.js.org/configuration/cache/
const getCache = (
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

export const baseWebpackConfig = ({
  // defaults
  // externalsConfig = { modulesFromFile: true }, // verify this
  // sideEffects = ['./app/components/**/*.js', '*.css'], doesnt work like in pkgjson, keep this comment

  // required
  entry,

  copyOptions, // @see https://stackoverflow.com/questions/49852038/copy-files-with-copywebpackplugin
  pack = {}, // provided by setup.webpack.config.mjs
  configFile = false, // todo: absolute path to a babelConfigFile

  // other shit
  cache = false,
  context = process.cwd(), // you generally want to pass this in and not rely on process.cwd()
  entryPush = [],
  entryUnshift = [],
  extensions = ['.mjs', '.js', '.jsx', '.jsx', '.json'],
  externals = [],
  mainFields = ['module', 'browser', 'main'], // TODO: confirm this
  mode = 'development',
  optimization = {},
  output = {},
  plugins = [],
  processEnv = {},
  publicPath = 'auto', // @see https://webpack.js.org/guides/public-path/#automatic-publicpath
  stats = 'summary',
  target = 'web',

  // dependent1
  basePlugins = getDefaultPlugins({ copyOptions }),
  devtool = pack.ifProd ? 'hidden-source-map' : 'eval-source-map',
  // deps = Object.keys(pkgJson.dependencies || {}),
  // peerDeps = Object.keys(pkgJson.peerDependencies || {}),

  // loaders
  // should always be last to use defaults and dependents
  stringReplaceLoader = {
    // test: /\.(html|m?js)$/, // doesnt work when part of use: []
    loader: 'string-replace-loader', // we use this instead of dotenv-webpack
    options: {
      multiple: Object.entries(processEnv).map(([search, replace]) => ({
        search,
        replace,
      })),
    },
  },

  // @see https://webpack.js.org/configuration/experiments/#root
  experiments = {
    // futureDefaults: false,
    asyncWebAssembly: true, // make a webassembly module an async module
    buildHttp: true, // build remote resource that begin with http(s)
    cacheUnaffected: true,
    layers: true,
    lazyCompilation: false,
    outputModule: false,
    syncWebAssembly: false,
    topLevelAwait: true,
  },

  ...rest
}: WebpackSetupType ): WebpackConfigType => ({
    ...rest,
    cache: getCache(cache, pack),
    context,
    devtool,
    entry: Array.isArray(entry) ? entryUnshift.concat(entry, entryPush).filter((e) => e) : entry,
    experiments,
    externals: (pack.builtinModules || []).concat(externals),
    infrastructureLogging: {
      // TODO: add this to fn params for overriding
      // @see https://webpack.js.org/configuration/other-options/#infrastructurelogging
      level: 'info',
    },
    mode,
    // use to be [generateLoaders...]
    module: {
      // $FlowFixMe[incompatible-return]
      rules: Object.values(generateLoaders({
        stringReplaceLoader,
        configFile
        })).filter((x) => x),
    },
    optimization,
    output: {
      charset: true,
      chunkFilename: '[name].chunk.js',
      clean: false, // just do this manually
      compareBeforeEmit: true, // dont emit files if the file already exists with same content
      filename: '[name].js',
      path: pack.pathDist,
      publicPath,
      ...output,
    },
    plugins: plugins.concat(basePlugins).filter((x) => x),
    resolve: { extensions, mainFields },
    stats,
    target,
  });
