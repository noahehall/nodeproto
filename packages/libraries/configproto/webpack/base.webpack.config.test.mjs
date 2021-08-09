import { fileURLToPath } from 'url';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import baseWebpackConfig from './base.webpack.config.mjs';
import path from 'path';
import setupWebpackConfig from './setup.webpack.config.mjs';
import testCompiler from './test.compiler.mjs';

export const getConfig = (overrides = {}) => ({
  builtinModules: [],
  entry: ['./webpack/fixtures/esm.mjs'],
  mode: 'development',
  pathDist: thisDir + '/dist',
  pathSrc: thisDir,

  ...overrides
});

// === $(pwd) on cli
// TODO: test with pack.resolve which should give you the abs path of whatever
const thisDir = path.dirname(fileURLToPath(import.meta.url));

const test = suite('base.webpack.config.mjs');

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
  assert.type(
    baseWebpackConfig(getConfig()),
    'object',
    'returns object without setup.webpack.config.mjs'
  );

  assert.type(
    baseWebpackConfig(getConfig(setupWebpackConfig())),
    'object',
    'returns object with setup.webpack.config.mjs'
  );
});

test('compilation', async () => {
  const data = getConfig();

  assert.type(
    await testCompiler(baseWebpackConfig(data)),
    'object',
    'compiles successfully without setup.webpack.config.mjs'
  );

  const { config, pack } = setupWebpackConfig();

  assert.type(
    pack,
    'object',
    'provides pack object'
  );

  assert.type(
    await testCompiler(baseWebpackConfig({
      builtinModules: pack.builtinModules,
      entry: data.entry,
      pathDist: pack.pathDist,
      pathSrc: pack.pathSrc,

      ...config
    })),
    'object',
    'compiles successfully with setup.webpack.config.mjs'
  );
});

// help determining what error is
test.skip('throws', () => {
  const config = getConfig();
  delete config.mode;

  // this should throw and reveal error in console
  assert.ok(
    baseWebpackConfig(config)
  );
});

test.run();
