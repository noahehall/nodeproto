// @see https://webpack.js.org/contribute/writing-a-loader/#testing

import path from 'path';
import webpack from 'webpack';
import {
  createFsFromVolume,
  Volume,
} from 'memfs';

const __dirname = path.resolve('./dist/tests');

export const createConfig = ({ entry, ...loader } = {}) => ({
  // context: __dirname,
  entry,
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  },
  ...loader
});

export default function testCompiler(config = {}) {
  const testConfig = createConfig(config);

  const compiler = webpack(testConfig);

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    // err The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
}
