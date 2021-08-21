// @see https://webpack.js.org/contribute/writing-a-loader/#testing

import path from 'path';
import webpack from 'webpack';
import {
  createFsFromVolume,
  Volume,
} from 'memfs';

const __dirname = path.resolve('./dist/tests');

export default function testCompiler(entry) {
  const compiler = webpack({
    context: __dirname,
    entry,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
}
