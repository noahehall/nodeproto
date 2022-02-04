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

  assert.hasAllKeys(
    pack,
    ['builtinModules', 'ifDev', 'ifProd', 'pathDist', 'pathSrc', 'pkgJson'],
    'buildproto pack interface contract'
  );

  assert.isObject(
    await testCompiler(config),
    'compiles successfully without setup.webpack.config.mjs'
  );
});

test.run();
