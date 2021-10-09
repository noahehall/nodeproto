// @flowtodo
// TODO: move 99% of this shit to separate file
// TODO: require pack from setup.webpack. ot make life easier for us and consumers

// @see https://webpack.js.org/plugins/copy-webpack-plugin/
import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import svgToMiniDataURI from 'mini-svg-data-uri';

// likely not needed as we continue to integrate flow
const t = (msg = 'required', p = 'error in baseWebpackConfig: ') => { throw new Error(`${p}${msg}`); };

const r = thing => t(`${thing} is required in base.webpack.config`);

const getDefaultPlugins = ({ copyOptions }) => [
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

].filter(x => x);

// @see https://webpack.js.org/guides/asset-modules/
// @see https://webpack.js.org/configuration/output/#template-strings
// asset/resource: emit separate file (e.g. file-loader)
// asset/inline: export data uri (e.g. url-loader)
// asset/source: export source code (e.g. raw-loader)
// asset: automatically choose (e.g. url-loader with asset size limit)
const getAssetLoaders = () => ({
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
  videoLoader: {
    test: /\.(mp4|webm)$/,
    type: 'asset/resource',
    generator: { filename: '[file][query]' },
  },
  svgLoader: {
    test: /\.svg$/,
    type: 'asset/inline',
    generator: {
      filename: '[file][query]',
      dataUrl: content => svgToMiniDataURI(content.toString()),
    },
  },
});

const generateLoaders = ({
  stringReplaceLoader,
  configFile,
}) => ({
  cssExternalLoader: {
    test: /\.css$/,
    include: /node_modules/,
    use: [
      'style-loader',
      'css-loader'
    ],
  },

  cssInternalLoader: {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      'style-loader',
      'css-loader'
    ],
  },

  ...getAssetLoaders(),
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
          sourceType: "unambiguous",
          configFile: configFile || './node_modules/@nodeproto/configproto/src/babel/flow.babelrc',
        },
      },
      stringReplaceLoader,
    ]
  },
});

// @see https://webpack.js.org/configuration/cache/
const getCache = (cache, pack = r('pack => getCache()')) => {
  if (!pack.pkgJson) r('pack.pkgJson => getCache');
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

export default function baseWebpackConfig ({
  // defaults
  // externalsConfig = { modulesFromFile: true }, // verify this
  // sideEffects = ['./app/components/**/*.js', '*.css'], doesnt work like in pkgjson, keep this comment

  // required
  entry = r('entry: Array|string|object|descriptor'),

  // provided by pack, but still overridable
  copyOptions,  // @see https://stackoverflow.com/questions/49852038/copy-files-with-copywebpackplugin
  pack = {}, // provided by setup.webpack.config.mjs
  builtinModules = pack.builtinModules || [], // TODO: update tests this shouldnt be required
  ifDev = pack.ifDev,
  ifProd = pack.ifProd,
  configFile = false, // todo: absolute path to a babelConfigFile
  pathDist = pack.pathDist || r('pathDist: String'),
  pathSrc = pack.pathSrc || r('pathSrc: String'),
  pkgJson = pack.pkgJson || null,

  // other shit
  cache = false,
  context = process.cwd(), // you generally want to pass this in and not rely on process.cwd()
  entryPush = [],
  entryUnshift = [],
  extensions = ['.mjs','.js','.jsx', '.jsx','.json'],
  externals = [],
  mainFields = ['module','browser','main'], // TODO: confirm this
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
  devtool = ifProd ? 'hidden-source-map' : 'eval-source-map',
  // deps = Object.keys(pkgJson.dependencies || {}),
  // peerDeps = Object.keys(pkgJson.peerDependencies || {}),

  // loaders
  // should always be last to use defaults and dependents
  stringReplaceLoader = {
    // test: /\.(html|m?js)$/, // doesnt work when part of use: []
    loader: 'string-replace-loader', // we use this instead of dotenv-webpack
    options: {
      multiple: Object.entries(processEnv).map(([
        search,
        replace
      ]) => ({ search, replace }))
    }
  },

  // @see https://webpack.js.org/configuration/experiments/#root
  experiments = {
    // futureDefaults: false,
    cacheUnaffected: true,
    asyncWebAssembly: true, // make a webassembly module an async module
    buildHttp: true, // build remote resource that begin with http(s)
    layers: true,
    lazyCompilation: false,
    outputModule: false,
    syncWebAssembly: false,
    topLevelAwait: true,
  },

  // overrides top level properties
  ...overrides
} = {}) {
  return {
    cache: getCache(cache, pack),
    context,
    devtool,
    entry: Array.isArray(entry) ? entryUnshift.concat(entry, entryPush).filter(e => e) : entry,
    experiments,
    externals: builtinModules.concat(externals),
    infrastructureLogging: {
      // TODO: add this to fn params for overriding
      // @see https://webpack.js.org/configuration/other-options/#infrastructurelogging
      level: 'info',
      colors: true,
    },
    mode,
    // use to be [generateLoaders...]
    module: { rules: Object.values(generateLoaders({ pathSrc, stringReplaceLoader, configFile })).filter(x => x) },
    optimization,
    output: {
      charset: true,
      chunkFilename: '[name].chunk.js',
      filename: '[name].js',
      path: pathDist,
      publicPath,
      clean: false, // just do this manually
      compareBeforeEmit: true, // dont emit files if the file already exists with same content
      ...output,
    },
    plugins: (plugins.concat(basePlugins)).filter(x => x),
    resolve: { extensions, mainFields },
    stats,
    target,

    ...overrides,
  };
}
