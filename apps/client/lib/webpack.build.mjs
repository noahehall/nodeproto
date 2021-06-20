/**
 * build any webpack config and output its files to disk
 */

import { envproto } from '@nodeproto/utils';
import * as pack from './webpack.setup.mjs';
import webpack from 'webpack';
import webpackDevConfig from './webpack.dev.config.mjs';
import webpackProdConfig from './webpack.prod.config.mjs';

// todo
// const conditions = envproto.getConditions();

const useConfig = pack.ifProd && false ? webpackProdConfig : webpackDevConfig;

const handleConfigErrors = ({
  stack = 'stack undefined',
  details = 'details undefined',
  ...err
}) => console.error({ err, stack, details, });

// @see https://webpack.js.org/configuration/stats/
const statsOptions = {
  maxModules: Infinity,
  optimizationBailout: true,
  errorDetails: true,
};

const handleCompileIssues = (stats) => {
  if (stats.hasErrors() || stats.hasWarnings()) {
    const {errors, warnings, ...info} = stats.toJson();
    console.error({ errors, warnings });
  }

  // todo
  console.log(stats.toString({ ...statsOptions, chunks: false, colors: true }))
}

const compilerCallback = (err, stats) => {
  if (err) return handleConfigErrors(err);
  handleCompileIssues(stats);

}

webpack(useConfig, compilerCallback);
