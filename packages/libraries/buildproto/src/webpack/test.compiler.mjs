// @flow

// @see https://webpack.js.org/contribute/writing-a-loader/#testing
// TODO: move this file into #t

import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import webpack from 'webpack';

import type {
  ObjectType,
  Stats,
  WebpackConfigType,
} from '../../libdefs';

export const createConfig = ({
  entry,
  output = {
    path: path.resolve('./dist/tests'),
    filename: 'bundle.js',
  },
  ...rest
}: WebpackConfigType): ObjectType => {
  return {
    // context: __dirname,
    ...rest,
    entry,
    output,
  };
};

export const testCompiler = async (
  config: WebpackConfigType): Promise<Stats | Error> => {
  const testConfig = createConfig(config);
  const compiler = webpack(testConfig);

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
