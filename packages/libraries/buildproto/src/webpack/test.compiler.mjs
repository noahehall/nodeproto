// $FlowTODO
// @see https://webpack.js.org/contribute/writing-a-loader/#testing
// TODO: move this file into #t

import { createFsFromVolume, Volume } from "memfs";

import path from "path";
import webpack from "webpack";

export const createConfig = ({ entry, ...loader } = {}) => ({
  // context: __dirname,
  entry,
  output: {
    path: path.resolve("./dist/tests"),
    filename: "bundle.js",
  },
  ...loader,
});

export default async function testCompiler(config = {}) {
  const testConfig = createConfig(config);

  const compiler = webpack(testConfig);

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(new Error(err.message));
      else if (stats.hasErrors()) {
        const errors = stats.toJson().errors;

        console.info(errors);

        reject(new Error(errors[0].message || "stats has errors"));
      } else resolve(stats);
    });
  });
}
