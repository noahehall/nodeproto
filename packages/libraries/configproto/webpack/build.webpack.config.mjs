/**
 * build any webpack config and output its files to disk|memfs
 */

// import webpackDevConfig from './webpack.dev.config.mjs';
// import webpackProdConfig from './webpack.prod.config.mjs';

import testCompiler from './test.compiler.mjs';
import webpack from 'webpack';

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
    const { errors, warnings/*, ...info */ } = stats.toJson();
    console.error({ errors, warnings });

    if (errors.length) throw new Error('errors exist');
  }

  console.info(stats.toString({ ...statsOptions, chunks: false, colors: true }));
};

const compilerCallback = (err, stats) => {
  if (err) return handleConfigErrors(err);
  handleCompileIssues(stats);
};

export default function webpackBuild(useConfig = 'THROW IF MISSING', toDisk = true) {
  return toDisk
    ? webpack(useConfig, compilerCallback)
    : testCompiler(useConfig);
}