// import CircularDependencyPlugin from 'circular-dependency-plugin'
import { envproto } from '@nodeproto/utils'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import pkgJson from '../package.json'
import webpack from 'webpack'
import webpackBaseConfig from './webpack.base.config.mjs'

const env = envproto.syncEnvAndConfig(pkgJson)

const context = process.cwd()
const pathDist = path.resolve(
  context,
  env.directories.dist
)

export default webpackBaseConfig({
  entryUnshift: [
    'react-devtools',
    'webpack-hot-middleware-2/client'
  ],
  env,
  // output: { globalObject: 'this' },
  context,

  plugins: [

    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      template: env.config.HTML_INDEX,
    }),

    // new ScriptExtHtmlWebpackPlugin({
    //   module: /(workers|sw)/,
    // }),
  ],
})
