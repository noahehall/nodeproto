// @flow
// import * as flowFixtures from './fixtures/flow.mjs';
import { fileURLToPath } from 'url';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import FlowRMTLoader from './removeFlowTypesLoader.mjs';
import implementation from 'esbuild';
import path from 'path';
import testCompiler, { createConfig } from './test.compiler.mjs';

const instance = new FlowRMTLoader(`
  // @flow
  const poop: string = 'flush';
`);

// @see https://webpack.js.org/contribute/writing-a-loader/#absolute-paths
// dont use absolute paths as it breaks hashing
const config = {
  // eslint-disable-next-line flowtype-errors/show-errors
  context: path.dirname(fileURLToPath(import.meta.url)),
  entry: './fixtures/flow.mjs',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        use: {
          loader: './fixtures/fakeLoader.cjs',
          options: {},
        },
      },
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        use: {
          loader: './fixtures/fakeLoader.mjs',
          options: {},
        },
      },
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        use: {
          loader: './removeFlowTypesLoader.mjs',
          options: {},
        },
      },
      {
        test: /\.jsx$/,
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
            loader: FlowRMTLoader,
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

// @see https://github.com/lukeed/uvu/blob/master/docs/cli.md
// @see https://github.com/lukeed/uvu/blob/master/docs/api.assert.md
// @see https://github.com/lukeed/uvu/tree/master/examples
// @see https://github.com/lukeed/uvu/tree/master/examples/esbuild
// @see https://github.com/bcoe/c8
// @see https://github.com/lukeed/uvu/blob/master/examples/coverage/package.json
// @see https://github.com/lukeed/watchlist
// ^ maybe chokidar instead

const test = suite('removeFlowTypesLoader');

const result = instance();
test('is function', () => {
  assert.type(FlowRMTLoader, 'function');
});

test('returns string', () => {
  assert.type(instance(), 'string', 'should return a string');
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
  const result = await testCompiler(getConfig(0));
  assert.type(result, 'object');
});

test('sanity check with external mjs loader', async () => {
  const result = await testCompiler(getConfig(1));
  assert.type(result, 'object', 'wtf');
});

test('webpack + flowRemoveTypesLoader', async () => {
  const result = await testCompiler(getConfig(2));
  assert.type(result, 'object');
});

test('webpack + flowRemoveTypesLoader + esbuild-loader', async () => {
  const result = await testCompiler(getConfig(3));
  assert.type(result, 'object');
});

test.run();
