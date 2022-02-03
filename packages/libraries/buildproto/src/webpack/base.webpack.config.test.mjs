import * as t from '@nodeproto/testproto/t';

import { baseWebpackConfig, testCompiler } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('base.webpack.config');

test.before.each((context) => {
  const baseWebpackOptions = {
    entry: ['./src/fixtures/esm.mjs'],
  };

  context.fixtures = {
    baseWebpackOptions,
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('baseWebpackConfig', async ({ fixtures }) => {
  const { baseWebpackOptions } = fixtures;

  const config = await baseWebpackConfig(baseWebpackOptions);

  assert.isObject(config, 'returns webpack config');
  assert.hasAllKeys(config, [
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
  ]);

  assert.isObject(
    await testCompiler(config),
    'compiles successfully without setup.webpack.config.mjs'
  );
});

test.run();
