import * as t from '@nodeproto/testproto/t';
import path from 'node:path';

import { baseWebpackConfig, testCompiler } from '@nodeproto/buildproto';

import { getPackInterface } from '../pack.test.mjs';

const { assert } = t;

const test = t.suite('base.webpack.config');

test.before.each((context) => {
  const baseWebpackOptions = {
    entry: ['./src/fixtures/esm.mjs'],
  };

  const copyOptions = {
    patterns: [
      {
        context: path.resolve('./src'),
        from: './**/*.(json|png)',
        to: path.resolve('./dist'),
      },
    ],
  };

  context.fixtures = {
    baseWebpackOptions,
    withCopyOptions: Object.assign({}, baseWebpackOptions, { copyOptions }),
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('baseWebpackConfig', async ({ fixtures }) => {
  baseWebpackConfig({})
    .then(() => assert.fails('should not resolve'))
    .catch((e) => assert.match(e.message, /entry/));

  const { baseWebpackOptions } = fixtures;

  const { config, pack } = await baseWebpackConfig(baseWebpackOptions);

  assert.isObject(config, 'webpack config');
  assert.isObject(pack, 'pack meta object');

  assert.hasAllKeys(
    config,
    [
      'cache',
      'context',
      'devtool',
      'entry',
      'experiments',
      'externals',
      'infrastructureLogging',
      'mode',
      'module',
      'optimization',
      'output',
      'plugins',
      'resolve',
      'stats',
      'target',
    ],
    'webpack interface contract'
  );

  assert.hasAllKeys(pack, getPackInterface(), 'buildproto pack interface contract');

  assert.isObject(await testCompiler(config), 'compiles successfully');
});

test('baseWebpackConfig: copyOptions', async ({ fixtures }) => {
  const { withCopyOptions } = fixtures;

  const { config, pack } = await baseWebpackConfig(withCopyOptions);

  assert.isObject(config, 'webpack config');
  assert.isObject(pack, 'pack meta object');

  // will fail if copy-webpack-plugin doesnt find any files to copy
  assert.isObject(await testCompiler(config), 'compiles successfully');
});

test.run();
