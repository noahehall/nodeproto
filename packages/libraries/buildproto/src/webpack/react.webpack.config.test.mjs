import * as t from '@nodeproto/testproto/t';

import { reactWebpackConfig, testCompiler } from '@nodeproto/buildproto';

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

test.after.each((context) => {
  delete context.fixtures;
});

test('reactWebpackConfig', async ({ fixtures }) => {
  const { reactDevWebpackOptions } = fixtures;
  const { config, pack } = await reactWebpackConfig(reactDevWebpackOptions);

  assert.isObject(config, 'webpack object');
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

  assert.hasAllKeys(
    pack,
    ['builtinModules', 'ifDev', 'ifProd', 'pathDist', 'pathSrc', 'pkgJson'],
    'buildproto pack interface contract'
  );

  assert.isObject(await testCompiler(config), 'compiles esm successfuly');
});

test.run();
