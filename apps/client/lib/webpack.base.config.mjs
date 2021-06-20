import * as pack from './webpack.setup.mjs';

/**
 *
 * @param options everything is configurable
 * @returns webpack configuration object
 */
export default function mikeTysonPunchOut ({
  // defaults
  // externalsConfig = { modulesFromFile: true },
  // sideEffects = ['./app/components/**/*.js', '*.css'], doesnt work like in pkgjson,
  babelConfig = pack.babelConfigDefault(),
  context = pack.context,
  devtool = pack.ifProd ? 'hidden-source-map' : 'eval-cheap-module-source-map',
  entryPush = [],
  entryUnshift = [],
  env = pack.env,
  extensions = [ '.mjs', '.js', '.jsx', '.json'],
  externals = [],
  ifDev = pack.ifDev,
  ifProd = pack.ifProd,
  mainFields = [ 'module', 'browser', 'main' ],
  mode = pack.mode,
  optimization = pack.optimization,
  output = {},
  outputDefault = { filename: '[name].js', chunkFilename: '[name].chunk.js' },
  pathDist = pack.pathDist,
  pathSrc = pack.pathSrc,
  plugins = [],
  publicPath = '/',
  stats = 'summary',
  target = 'web',

  // dependent1
  deps = Object.keys(env.dependencies || {}),
  entry = [env.config.REACT_APP_FILE],
  peerDeps = Object.keys(env.peerDependencies || {}),

  // loaders
  // should always be last to use defaults and dependents
  stringReplaceLoader = {
    // test: /\.(html|m?js)$/,
    loader: 'string-replace-loader', // we use this instead of dotenv-webpack
    options: {
      multiple: Object.entries(env.processEnv).map(([
        search,
        replace
      ]) => ({ search, replace }))
    }

  },

  jsLoader = {
    test: /\.m?js$/,
    type: 'javascript/auto',
    include: [pathSrc],
    use: [
      { loader: 'babel-loader', options: babelConfig },
      stringReplaceLoader,
    ]
  },

  cssInternalLoader = {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      'style-loader',
      'css-loader'
    ],
  },

  cssExternalLoader = {
    test: /\.css$/,
    include: /node_modules/,
    use: [
      'style-loader',
      'css-loader'
    ],
  },

  fontLoader = {
    test: /\.(eot|otf|ttf|woff|woff2)$/,
    use: 'file-loader',
  },

  svgLoader = {
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

  imageLoader = {
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

  videoLoader = {
    test: /\.(mp4|webm)$/,
    use: {
      loader: 'url-loader',
      options: {
        limit: 10000,
      },
    },
  },

  // overrides top level properties
  ...overrides
} = {}) {
  if (!entry.length) throw `${msg} no enty specified`;

  return {
    context,
    devtool,
    entry: entryUnshift.concat(entry, entryPush).filter(e => e),
    externals: pack.builtinModules.concat(externals),
    mode,
    optimization,
    plugins: plugins.filter(x => x),
    resolve: { extensions, mainFields },
    stats,
    target,

    output: {
      path: pathDist,
      publicPath,
      ...outputDefault,
      ...output,
    },

    module: {
      rules: [
        // sideEffects, // doesnt fkn work? use package.json instead
        jsLoader,
        cssInternalLoader,
        cssExternalLoader,
        fontLoader,
        svgLoader,
        imageLoader,
        videoLoader,
      ].filter(x => x)
    },

    ...overrides,
  }
}
