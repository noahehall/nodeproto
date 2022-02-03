// import * as t from '@nodeproto/testproto';
// import { dirs } from '@nodeproto/wtf';

// import flowTypeCleaner from './FlowTypeCleaner.cjs';
// import implementation from 'esbuild';

// import testCompiler, { createConfig } from '../test.compiler';

// const { assert } = t;

// const thisDir = dirs.dirname(import.meta.url);
// const fixtures = '../../../fixtures/';

// // @see https://webpack.js.org/contribute/writing-a-loader/#absolute-paths
// // dont use absolute paths as it breaks hashing
// const config = {
//   context: thisDir,
//   entry: fixtures + 'flow.mjs',
//   module: {
//     rules: [
//       {
//         test: /\.mjs$/,
//         type: 'javascript/esm',
//         use: {
//           loader: fixtures + 'fakeLoader.cjs',
//           options: {},
//         },
//       },
//       {
//         test: /\.mjs$/,
//         type: 'javascript/esm',
//         use: {
//           loader: './FlowTypeCleaner.cjs',
//           options: {},
//         },
//       },
//       {
//         test: /\.mjs$/,
//         use: [
//           {
//             loader: 'esbuild-loader',
//             options: {
//               implementation,
//               loader: 'jsx',
//               target: 'es2015',
//             },
//           },
//           {
//             loader: './FlowTypeCleaner.cjs',
//             options: {
//               /* ... */
//             },
//           },
//         ],
//       },
//     ],
//   },
// };

// const r = (thing, msg = 'is required') => {
//   throw new Error(`${thing} ${msg}`);
// };

// const getConfig = (i = r('index')) => ({
//   ...config,
//   module: {
//     ...config.module,
//     rules: [config.module.rules[i]],
//   },
// });

// const test = t.suite('FlowTypeCleaner');

// const result = flowTypeCleaner(` // eslint-disable-line @babel/new-cap
//   // @flow
//   const poop: string = 'flush';
// `);

// test('is function', () => {
//   assert.isFunction(flowTypeCleaner);
// });

// test('returns string', () => {
//   assert.isString(result);
// });

// test('removes @flow from source', () => {
//   assert.notInclude(result, '@flow');
// });

// test('removes types from source', () => {
//   assert.notInclude(result, ': string');
// });

// test('creates config', () => {
//   assert.ok(createConfig(config), 'creates config');
// });

// test('sanity check with external cjs loader', async () => {
//   assert.isObject(await testCompiler(getConfig(0)));
// });

// test('FlowTypeCleaner', async () => {
//   assert.isObject(await testCompiler(getConfig(1)));
// });

// test('webpack + FlowTypeCleaner', async () => {
//   assert.isObject(await testCompiler(getConfig(1)));
// });

// test('webpack + FlowTypeCleaner + esbuild-loader', async () => {
//   assert.isObject(await testCompiler(getConfig(2)));
// });

// test.run();
