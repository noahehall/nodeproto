// import * as t from '@nodeproto/testproto';
// import { dirs } from '@nodeproto/wtf';

// import path from 'path';
// import reactEsbuildWebpackConfig from './react.esbuild.webpack.config';
// import testCompiler from './test.compiler';

// const { assert } = t;

// const thisDir = dirs.dirname(import.meta.url);
// const fixtures = '../../fixtures/';
// const getEntry = (file) => path.resolve(thisDir, fixtures, file);

// export const getOpts = (overrides) => ({
//   entry: '',
//   htmlOptions: {},
//   outputDir: thisDir + '/dist',

//   ...overrides,
// });

// const test = t.suite('react.esbuild.webpack.config');

// test('throws', () => {
//   let opts = getOpts();
//   delete opts.entry;

//   assert.throws(() => reactEsbuildWebpackConfig(opts), /entry is required/, 'if missing entry');

//   opts = getOpts();
//   delete opts.htmlOptions;

//   assert.throws(
//     () => reactEsbuildWebpackConfig(opts),
//     /htmlOptions is required/,
//     'if missing htmlOptions'
//   );

//   opts = getOpts();
//   delete opts.outputDir;

//   assert.throws(
//     () => reactEsbuildWebpackConfig(opts),
//     /outputDir is required/,
//     'if missing outputDir'
//   );
// });

// test('is okay', () => {
//   assert.isObject(reactEsbuildWebpackConfig(getOpts()), 'returns config object');
// });

// test('compilation', async () => {
//   const opts = getOpts({
//     entry: getEntry('esm.mjs'),
//   });

//   assert.isObject(await testCompiler(reactEsbuildWebpackConfig(opts)), 'compiles esm successfuly');

//   assert.isObject(
//     await testCompiler(
//       reactEsbuildWebpackConfig({
//         ...opts,
//         entry: getEntry('commonjs.cjs'),
//       })
//     ),
//     'compiles cjs successfuly'
//   );

//   // assert.isObject(
//   //   await testCompiler(reactEsbuildWebpackConfig({
//   //     ...opts,
//   //     entry: getEntry('react.jsx'),
//   //   })),
//   //   'compiles jsx successfuly'
//   // );

//   assert.isObject(
//     await testCompiler(
//       reactEsbuildWebpackConfig({
//         ...opts,
//         entry: getEntry('auto.js'),
//       })
//     ),
//     'interprets js and compiles successfuly'
//   );

//   assert.isObject(
//     await testCompiler(
//       reactEsbuildWebpackConfig({
//         ...opts,
//         entry: getEntry('flow.mjs'),
//       })
//     ),
//     'removes flowtypes and compiles esm successfuly'
//   );
// });

// test.run();
