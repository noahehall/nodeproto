// import * as t from '@nodeproto/testproto';
// import { dirs } from '@nodeproto/wtf';

// import path from 'path';
// import reactDevWebpackConfig from './react.dev.webpack.config';
// import testCompiler from './test.compiler';

// const { assert } = t;

// const thisDir = dirs.dirname(import.meta.url);
// const fixtures = '../../fixtures/';
// const getEntry = (file) => path.resolve(thisDir, fixtures, file);

// export const getOpts = (overrides) => ({
//   cache: false,
//   entry: [],
//   htmlOptions: {},
//   output: { path: thisDir + '/dist' },
//   pack: { pkgJson: {} },
//   pathDist: thisDir + '/dist',
//   pathSrc: thisDir,

//   ...overrides,
// });

// const test = t.suite('react.dev.webpack.config.mjs');

// test('throws', () => {
//   let opts = getOpts();
//   delete opts.entry;

//   assert.throws(
//     () => reactDevWebpackConfig(opts),
//     /entry: \[\]\|{}: is required/,
//     'if missing entry'
//   );

//   opts = getOpts();
//   delete opts.htmlOptions;

//   assert.throws(
//     () => reactDevWebpackConfig(opts),
//     /htmlOptions: \[\]\|{}: is required/,
//     'if missing htmlOptions'
//   );
// });

// test('is okay', () => {
//   assert.isObject(reactDevWebpackConfig(getOpts()), 'returns config object');
// });

// test('compilation', async () => {
//   const opts = getOpts({
//     entry: [getEntry('esm.mjs')],
//   });

//   assert.isObject(await testCompiler(reactDevWebpackConfig(opts)), 'compiles esm successfuly');

//   assert.isObject(
//     await testCompiler(
//       reactDevWebpackConfig({
//         ...opts,
//         entry: [getEntry('commonjs.cjs')],
//       })
//     ),
//     'compiles cjs successfuly'
//   );

//   // TODO: i've never used .jsx extension
//   // add @babel/preset-react to base.webpack.config.mjs if that changes
//   // assert.isObject(
//   //   await testCompiler(reactDevWebpackConfig({
//   //     ...opts,
//   //     entry: [getEntry('react.jsx')],
//   //   })),
//   //   'object',
//   //   'compiles jsx successfuly'
//   // );

//   assert.isObject(
//     await testCompiler(
//       reactDevWebpackConfig({
//         ...opts,
//         entry: [getEntry('auto.js')],
//       })
//     ),
//     'interprets js and compiles successfuly'
//   );

//   assert.isObject(
//     await testCompiler(
//       reactDevWebpackConfig({
//         ...opts,
//         entry: [getEntry('flow.mjs')],
//       })
//     ),
//     'removes flowtypes and compiles esm successfuly'
//   );
// });

// test.run();
