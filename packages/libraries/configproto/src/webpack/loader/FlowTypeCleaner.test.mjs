// @flow

import { fileURLToPath } from 'url';

import FlowTypeCleaner from './FlowTypeCleaner.cjs';
import implementation from 'esbuild';
import path from 'path';
import testCompiler, { createConfig } from '../test.compiler.mjs';
import t from '#t';

const { assert } = t;

const fixtures = '../../test/fixtures/';

// @see https://webpack.js.org/contribute/writing-a-loader/#absolute-paths
// dont use absolute paths as it breaks hashing
const config = {
  // eslint-disable-next-line flowtype-errors/show-errors
  context: path.dirname(fileURLToPath(import.meta.url)),
  entry: fixtures + 'flow.mjs',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/esm',
        use: {
          loader: fixtures + 'fakeLoader.cjs',
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

const test = t.suite('FlowTypeCleaner');

const result = FlowTypeCleaner(`
  // @flow
  const poop: string = 'flush';
`);

test('is function', () => {
  assert.isFunction(FlowTypeCleaner);
});

test('returns string', () => {
  assert.isString(result);
});

test('removes @flow from source', () => {
  assert.notInclude(result, '@flow');
});

test('removes types from source', () => {
  assert.notInclude(result, ': string');
});

test('creates config', () => {
  assert.ok(createConfig(config), 'creates config');
});

test('sanity check with external cjs loader', async () => {
  assert.isObject(await testCompiler(getConfig(0)));
});

test('FlowTypeCleaner', async () => {
  assert.isObject(await testCompiler(getConfig(1)));
});

test('webpack + FlowTypeCleaner', async () => {
  const result = await testCompiler(getConfig(1));
  assert.isObject(result);
});

test('webpack + FlowTypeCleaner + esbuild-loader', async () => {
  const result = await testCompiler(getConfig(2));
  assert.isObject(result);
});

test.run();