// @flow
// import * as flowFixtures from './fixtures/flow.mjs';
import { fileURLToPath } from 'url';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import FlowTypeCleaner from './FlowTypeCleaner.cjs';
import implementation from 'esbuild';
import path from 'path';
import testCompiler, { createConfig } from '../test.compiler.mjs';


// @see https://webpack.js.org/contribute/writing-a-loader/#absolute-paths
// dont use absolute paths as it breaks hashing
const config = {
  // eslint-disable-next-line flowtype-errors/show-errors
  context: path.dirname(fileURLToPath(import.meta.url)),
  entry: '../fixtures/flow.mjs',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        use: {
          loader: '../fixtures/fakeLoader.cjs',
          options: {},
        },
      },
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        use: {
          loader: './FlowTypeCleaner.cjs',
          options: {},
        },
      },
      {
        test: /\.mjs$/,
        use: [
          {
              loader: 'esbuild-loader',
              options: {
                implementation,
                loader: 'jsx',
                target: 'es2015',
              },
            },
          {
            loader: './FlowTypeCleaner.cjs',
            options: {
              /* ... */
            },
          },
        ],
      },
    ],
  },
};

const r = (thing, msg = 'is required') => { throw new Error(`${thing} ${msg}`); };

const getConfig = (i = r('index')) => ({
  ...config,
  module: {
    ...config.module,
    rules: [config.module.rules[i]],
  },
});

const test = suite('FlowTypeCleaner');

const result = FlowTypeCleaner(`
  // @flow
  const poop: string = 'flush';
`);

test('is function', () => {
  assert.type(FlowTypeCleaner, 'function');
});

test('returns string', () => {
  assert.type(result, 'string', 'should return a string');
});

test('removes @flow from source', () => {
  assert.not(result.includes('@flow'), 'should remove string @flow');
});

test('removes types from source', () => {
  assert.not(result.includes(': string'), 'should remove string type');
});

test('creates config', () => {
  assert.ok(createConfig(config), 'creates config');
});

test('sanity check with external cjs loader', async () => {
  assert.type(await testCompiler(getConfig(0)), 'object');
});

test('FlowTypeCleaner', async () => {
  assert.type(await testCompiler(getConfig(1)), 'object');
});

test('webpack + FlowTypeCleaner', async () => {
  const result = await testCompiler(getConfig(1));
  assert.type(result, 'object');
});

test('webpack + FlowTypeCleaner + esbuild-loader', async () => {
  const result = await testCompiler(getConfig(2));
  assert.type(result, 'object');
});

test.run();
