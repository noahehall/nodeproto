// import { InjectManifest } from 'workbox-webpack-plugin'
// import externals from 'webpack-node-externals'
// import webpack from 'webpack'
import path from 'path'
import { builtinModules } from 'module';
import babelConfigDefault from './babel.config.cjs'

const msg = 'error in pack: '
const throwMsg = msg => { throw msg }

/**
 *
 * @param options everything is configursble
 * @returns webpack configuration object
 */
export default function pack ({
  // defaults
  babelConfig = babelConfigDefault(),
  context = process.cwd(),
  entryPush = [],
  entryUnshift = [],
  env = throwMsg('env is required in webpack.base.config.mjs, e.g. envproto.synEnvAndConfig(pkgJson)'),
  extensions = [
    '.mjs',
    '.js',
    '.jsx',
    '.json'
  ],
  externals = [],
  externalsConfig = { modulesFromFile: true },
  mainFields = [
    'module',
    'browser',
    'main'
  ],
  optimization = {},
  output = {},
  outputDefault = { filename: '[name].js', chunkFilename: '[name].chunk.js' },
  plugins = [],
  publicPath = '/',
  target = 'web',

  // dependent1
  deps = Object.keys(env.dependencies || {}),
  entry = [env.config.REACT_APP_FILE],
  mode = env.config.NODE_ENV,
  pathDist = path.resolve(
    context,
    env.directories.dist
  ),
  pathSrc = path.resolve(
    context,
    env.directories.app
  ),
  peerDeps = Object.keys(env.peerDependencies || {}),

  // dependent2
  ifDev = mode === 'development',
  ifProd = mode === 'production',

  // dependent3
  devtool = ifProd ? 'hidden-source-map' : 'eval-cheap-module-source-map',

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
    entry: [
      ...entryUnshift,
      ...entry,
      ...entryPush
    ].filter(e => e),
    externals: builtinModules.concat(externals),
    mode,
    optimization,
    plugins: [].concat(plugins).filter(x => x),
    target,

    resolve: { extensions, mainFields },
    output: {
      path: pathDist,
      publicPath,
      ...outputDefault,
      ...output,
    },

    module: {
      rules: [
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
