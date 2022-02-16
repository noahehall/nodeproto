// @flow

// @see https://webpack.js.org/contribute/writing-a-loader/#testing
// TODO: move this file into #t

import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import webpack from 'webpack';

import type { Stats, WebpackConfigType } from '../libdefs';

export const testCompiler = async (
  config: WebpackConfigType
): Promise<Stats | Error> => {
  // console.info('\n\n using testcompiler config', config);

  const compiler = webpack(config);

  // $FlowIgnore[prop-missing]
  compiler.outputFileSystem = createFsFromVolume(new Volume());
  // $FlowIgnore[prop-missing]
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(new Error(err.message));
      else if (stats.hasErrors()) {
        const errors = stats.toJson().errors;

        console.info(errors);

        reject(new Error(errors[0].message || 'stats has errors'));
      } else resolve(stats);
    });
  });
};
