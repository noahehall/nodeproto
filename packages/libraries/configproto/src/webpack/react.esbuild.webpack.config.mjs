// TODO: determine if should pipe through base.webpack.config.mjs
// we dont get 'exports not defined' when using base

import { ESBuildMinifyPlugin } from 'esbuild-loader';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import implementation from 'esbuild';
import webpack from 'webpack';

const { ProvidePlugin } = webpack;

const isR = arg => {
  throw new Error(`${arg} is required in react.esbuild.webpack.config.mjs`);
};

// @see https://github.com/privatenumber/esbuild-loader-examples
export default function reactEsbuildWebpackConfig ({
  // babelConfigFile = '@nodeproto/configproto/babel/flow', TODO: remove from tests
  entry = isR('entry'),
  htmlOptions = isR('htmlOptions'),
  outputDir = isR('outputDir'),
  pack,

  ...options
} = {}) {
  return {
    entry,
    mode: 'development',
    module: {
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
                sourceType: "unambiguous",
                // TODO: likely wont work with cjs
                configFile: fileURLToPath(new URL('../babel/flow.babelrc', import.meta.url))
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: false,
      minimizer: [
        new ESBuildMinifyPlugin(),
      ],
    },
    output: { libraryTarget: 'commonjs', path: outputDir },
    plugins: [
      new HtmlWebpackPlugin(htmlOptions),
      new ProvidePlugin({
        React: 'react',
      }),
    ],
    ...options,
  };
}