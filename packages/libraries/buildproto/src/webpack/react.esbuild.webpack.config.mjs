// @flow

import { ESBuildMinifyPlugin } from 'esbuild-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import implementation from 'esbuild';
import webpack from 'webpack';

import type { ObjectType, WebpackConfigType } from '../../libdefs';

// $FlowIgnore[incompatible-use]
const { ProvidePlugin } = webpack;

// @see https://github.com/privatenumber/esbuild-loader-examples
export const reactEsbuildWebpackConfig = ({
  // babelConfigFile = '@nodeproto/configproto/babel/flow', TODO: remove from tests
  entry,
  htmlOptions,
  outputDir,
  configFile = false, // todo: absolute path to a babelConfigFile
  mode = 'development',
  module = {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(c|m)?jsx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              implementation,
              loader: 'jsx',
              target: 'es2015',
            },
          },
          {
            loader: 'babel-loader',
            options: {
              sourceType: 'unambiguous',
              // configFile: configFile || './node_modules/@nodeproto/configproto/src/babel/flow.babelrc',
            },
          },
        ],
      },
    ],
  },
  optimization = {
    minimize: false,
    minimizer: [new ESBuildMinifyPlugin()],
  },
  output = { libraryTarget: 'commonjs', path: outputDir },
  plugins = [
    new HtmlWebpackPlugin(htmlOptions),
    new ProvidePlugin({ React: 'react' }),
  ],

  ...options
}: WebpackConfigType): ObjectType => ({
    ...options,
    entry,
    mode,
    module,
    optimization,
    output,
    plugins,
  });
