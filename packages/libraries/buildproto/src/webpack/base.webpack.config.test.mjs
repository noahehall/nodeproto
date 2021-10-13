import { dirs } from '@nodeproto/wtf/dirs';
import * as t from '@nodeproto/testproto';

import baseWebpackConfig from './base.webpack.config';
import setupWebpackConfig from './setup.webpack.config';
import testCompiler from './test.compiler';

const { assert } = t;

const thisDir = dirs.dirname(import.meta.url);

export const getConfig = (overrides = {}) => ({
  builtinModules: [],
  entry: ['./fixtures/esm.mjs'],
  mode: 'development',
  pathDist: thisDir + '/dist',
  pathSrc: thisDir,
  pack: { pkgJson: {} },

  ...overrides
});


const test = t.suite('base.webpack.config.mjs');

test('throws', () => {
  let config = getConfig();
  delete config.entry;

  assert.throws(
    () => baseWebpackConfig(config),
    /error in baseWebpackConfig: entry: Array\|string\|object\|descriptor is required in base.webpack.config/,
    'if missing entry'
  );

  config = getConfig();
  delete config.pathDist;

  assert.throws(
    () => baseWebpackConfig(config),
    /pathDist: String is required/,
    'if missing pathDist'
  );

  config = getConfig();
  delete config.pathSrc;

  assert.throws(
    () => baseWebpackConfig(config),
    /pathSrc: String is required/,
    'if missing pathSrc'
  );
});

test('is okay', () => {
  assert.isObject(
    baseWebpackConfig(getConfig()),
    'returns object without setup.webpack.config.mjs'
  );

  assert.isObject(
    baseWebpackConfig(getConfig(setupWebpackConfig())),
    'returns object with setup.webpack.config.mjs'
  );
});

test('compilation', async () => {
  const data = getConfig();

  assert.isObject(
    await testCompiler(baseWebpackConfig(data)),
    'compiles successfully without setup.webpack.config.mjs'
  );

  const { config, pack } = setupWebpackConfig();

  assert.isObject(
    pack,
    'provides pack object'
  );

  assert.isObject(
    await testCompiler(baseWebpackConfig({
      ...config,
      pack,
      entry: data.entry,
    })),
    'compiles successfully with setup.webpack.config.mjs'
  );
});

test.run();
