import { BundleStatsWebpackPlugin } from 'bundle-stats-webpack-plugin';
import { fileURLToPath } from 'url';

// likely not needed as we continue to integrate flow
const t = (msg = 'required', p = 'error in baseWebpackConfig: ') => { throw new Error(`${p}${msg}`); };

const r = thing => t(`${thing} is required`);

const defaultPlugins = [
  // @see https://github.com/relative-ci/bundle-stats/tree/master/packages/webpack-plugin
  new BundleStatsWebpackPlugin({
    baseline: false,
    compare: false,
    html: true,
    json: false,
    outDir: '../bundlestats',
    silent: false,
  }),
];

const generateLoaders = ({
  pathSrc,
  stringReplaceLoader,
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

  // @see https://github.com/webpack/webpack/issues/11467
  esmLoader: {
    test: /\.m?js$/,
    type: 'javascript/auto',
    // include: /node_modules/,
    resolve: { fullySpecified: false },
  },

  fontLoader: {
    test: /\.(eot|otf|ttf|woff|woff2)$/,
    use: 'file-loader',
  },

  imageLoader: {
    test: /\.(jpg|png|gif)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
        // Inline files smaller than 10 kB
          limit: 10 * 1024,
        },
      }
    ],
  },

  jsLoader: {
    exclude: /node_modules/,
    include: [pathSrc],
    test: /\.(c|m)?jsx?$/,
    type: 'javascript/auto',
    use: [
      {
        loader: 'babel-loader',
        options: {
          sourceType: "unambiguous",
          // TODO: likely wont work with cjs
          configFile: fileURLToPath(new URL('../babel/flow.babelrc', import.meta.url))
        },
      },
      stringReplaceLoader,
    ]
  },

  svgLoader: {
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-url-loader',
        options: {
        // Inline files smaller than 10 kB
          limit: 10 * 1024,
          noquotes: true,
        },
      }
    ],
  },

  videoLoader: {
    test: /\.(mp4|webm)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    },
  },
});

/**
 *
 * @param options everything is configurable
 * @returns webpack configuration object
 */
export default function baseWebpackConfig ({
  // defaults
  // externalsConfig = { modulesFromFile: true }, // verify this
  // sideEffects = ['./app/components/**/*.js', '*.css'], doesnt work like in pkgjson, keep this comment

  // required
  entry = r('entry: Array'),

  // provided by pack, but still overridable
  pack = {}, // provided by setup.webpack.config.mjs
  builtinModules = pack.builtinModules || [], // TODO: update tests this shouldnt be required
  ifDev = pack.ifDev,
  ifProd = pack.ifProd,
  pathDist = pack.pathDist || r('pathDist: String'),
  pathSrc = pack.pathSrc || r('pathSrc: String'),
  pkgJson = pack.pkgJson || {},

  // other shit
  basePlugins = defaultPlugins,
  context = process.cwd(),
  entryPush = [],
  entryUnshift = [],
  extensions = ['.mjs','.js','.jsx', '.jsx','.json'],
  externals = [],
  mainFields = ['module','browser','main'], // TODO: confirm this
  mode = 'development',
  optimization = {},
  output = {},
  outputDefault = { filename: '[name].js', chunkFilename: '[name].chunk.js' },
  plugins = [],
  processEnv = {},
  publicPath = 'auto', // @see https://webpack.js.org/guides/public-path/#automatic-publicpath
  stats = 'summary',
  target = 'web',

  // dependent1
  devtool = ifProd ? 'hidden-source-map' : 'eval-cheap-module-source-map',
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

  // overrides top level properties
  ...overrides
} = {}) {
  return {
    context,
    devtool,
    entry: entryUnshift.concat(entry, entryPush).filter(e => e),
    externals: builtinModules.concat(externals),
    mode,
    // use to be [generateLoaders...]
    module: { rules: Object.values(generateLoaders({ pathSrc, stringReplaceLoader })).filter(x => x) },
    optimization,
    output: {
      path: pathDist,
      publicPath,
      ...outputDefault,
      ...output,
    },
    plugins: (plugins.concat(basePlugins)).filter(x => x),
    resolve: { extensions, mainFields },
    stats,
    target,

    ...overrides,
  };
}
