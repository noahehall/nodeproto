// import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import implementation from 'esbuild';
import webpack from 'webpack';

const { ProvidePlugin } = webpack;

const isR = arg => {
  throw new Error(`${arg} is required in react.esbuild.webpack.config.mjs`);
};

// @see https://github.com/privatenumber/esbuild-loader-examples
export default function webpackEsbuildClient ({
  entry = isR('entry'),
  outputDir = isR('outputDir'),
  htmlOptions = isR('htmlOptions'),
  HtmlWebpackPlugin = isR('HtmlWebpackPlugin'),

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
                configFile: '@nodeproto/configproto/babel/flow'
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
