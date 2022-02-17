// @flow

import { logIt, throwIt } from '@nodeproto/shared';
import webpack from 'webpack';

import { testCompiler } from './test.compiler';

import type {
  ObjectType,
  Stats,
  WebpackConfigType,
} from '../libdefs';

export const handleConfigErrors = ({
  stack = 'stack undefined',
  details = 'details undefined',
  ...err
}: {
  stack: string,
  details: string,
  ...
}): void => console.error({ err, stack, details });

// @see https://webpack.js.org/configuration/stats/
const statsOptions = {
  maxModules: 100,
  optimizationBailout: true,
  errorDetails: true,
};

export const handleCompileIssues = (stats: Stats): void => {
  if (stats.hasErrors() || stats.hasWarnings()) {
    const { errors, warnings /*, ...info */ } = stats.toJson();

    console.error({ errors, warnings });

    if (errors.length) throwIt('errors exist: bundling webpack via @buildproto');
  }

  logIt(stats.toString({ ...statsOptions, chunks: false, colors: true }));
};

export const compilerCallback = (err: any, stats: Stats): void => {
  if (err) handleConfigErrors(err);
  else handleCompileIssues(stats);
};

export const buildWebpackConfig = (
  useConfig: WebpackConfigType,
  toDisk: boolean = true
): void => {
  if (toDisk) webpack(useConfig, compilerCallback);
  else testCompiler(useConfig);
};
