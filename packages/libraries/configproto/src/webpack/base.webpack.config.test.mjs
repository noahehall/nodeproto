import { fileURLToPath } from 'url';

import baseWebpackConfig from './base.webpack.config.mjs';
import path from 'path';
import setupWebpackConfig from './setup.webpack.config.mjs';
import t from '#t';
import testCompiler from './test.compiler.mjs';

const { assert } = t;

export const getConfig = (overrides = {}) => ({
  builtinModules: [],
  entry: ['./src/test/fixtures/esm.mjs'],
  mode: 'development',
  pathDist: thisDir + '/dist',
  pathSrc: thisDir,

  ...overrides
});

// === $(pwd) on cli
// TODO: test with pack.resolve which should give you the abs path of whatever
const thisDir = path.dirname(fileURLToPath(import.meta.url));

const test = t.suite('base.webpack.config.mjs');

test('throws', () => {
  let config = getConfig();
  delete config.entry;

  assert.throws(
    () => baseWebpackConfig(config),
    /entry: Array is required/,
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
      builtinModules: pack.builtinModules,
      entry: data.entry,
      pathDist: pack.pathDist,
      pathSrc: pack.pathSrc,

      ...config
    })),
    'compiles successfully with setup.webpack.config.mjs'
  );
});

test.run();
