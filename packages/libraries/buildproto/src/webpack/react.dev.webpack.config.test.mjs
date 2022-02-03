import * as t from '@nodeproto/testproto/t';

import { reactDevWebpackConfig, testCompiler } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('react.dev.webpack.config');

test.before.each((context) => {
  const reactDevWebpackOptions = {
    entry: ['./src/fixtures/esm.mjs'],
  };

  context.fixtures = {
    reactDevWebpackOptions,
  };
});

test('reactDevWebpackConfig', async ({ fixtures }) => {
  const { reactDevWebpackOptions } = fixtures;
  const config = await reactDevWebpackConfig(reactDevWebpackOptions);

  assert.isObject(config, 'returns webpack object');

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

  assert.isObject(await testCompiler(config), 'compiles esm successfuly');
});

test.run();
