import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import * as t from '@nodeproto/testproto';
const { suite, assert } = t;

const test = suite('configproto:import');

// hacky test to assert importable via normal import resolution
test('babel', () => {
  assert.throws(
    () => require('@nodeproto/configproto/babel/base'),
    /Unexpected token/,
  );

  assert.throws(
    () => require('@nodeproto/configproto/babel/client'),
    /Unexpected token/,
  );

  assert.throws(
    () => require('@nodeproto/configproto/babel/flow'),
    /Unexpected token/,
  );

  assert.throws(
    () => require('@nodeproto/configproto/babel/node'),
    /Unexpected token/,
  );

  // TODO: need a real integration test for this
  assert.throws(
    () => require('@nodeproto/configproto/babel/ssr'),
    /Unexpected token/,
  );
});

// hacky test to assert importable via normal resolution
test('browserslist', () => {
  assert.throws(
    () => require('@nodeproto/configproto/browserslist'),
    /Invalid or unexpected token/,
  );
});

// TODO: havent converted esbuild yet
test.skip('esbuild', async () => {
  assert.isObject(
    await import('@nodeproto/configproto/esbuild/backend'),
    'import backend.esbuild.config.mjs'
  );

  assert.isObject(
    await import('@nodeproto/configproto/esbuild/library'),
    'import library.esbuild.config.mjs'
  );

  // TODO: assert /esbuild exports an object containing both library & backend configs
});

// hacky test to assert importable via normal resolution
test('eslint', () => {
  assert.throws(
    () => require('@nodeproto/configproto/eslint'),
    /Invalid or unexpected token/,
  );
});

// hacky test to assert importable via normal resolution
test('flowconfig', () => {
  assert.throws(
    () => require('@nodeproto/configproto/flowconfig'),
    /Unexpected token/,
  );
});

// hacky test to assert importable via normal resolution
test('swc', () => {
  assert.throws(
    () => require('@nodeproto/configproto/swc/node'),
    /Unexpected token/,
  );
});


test('webpack', async () => {
  assert.isObject(
    await import('@nodeproto/configproto/webpack/bff/server'),
    'import server.webpack.mjs'
  );

  assert.isObject(
    await import('@nodeproto/configproto/webpack/loader/FlowTypeCleaner'),
    'import FlowTypeCleaner.cjs'
  );

  assert.isObject(
    await import('@nodeproto/configproto/webpack/base'),
    'import base.webpack.config.mjs'
  );

  assert.isObject(
    await import('@nodeproto/configproto/webpack/build'),
    'import build.webpack.config.mjs'
  );

  // TODO: need to convert
  // assert.isObject(
  //   await import('@nodeproto/configproto/webpack/prod'),
  //   'import prod.webpack.config.mjs'
  // );

  assert.isObject(
    await import('@nodeproto/configproto/webpack/react.dev'),
    'import react.dev.webpack.config.mjs'
  );

  assert.isObject(
    await import('@nodeproto/configproto/webpack/react.esbuild'),
    'import react.esbuild.webpack.config.mjs'
  );

  assert.isObject(
    await import('@nodeproto/configproto/webpack/setup'),
    'import setup.webpack.config.mjs'
  );
});

// figure out what the actual error is
// while not directly importable via node code
// various modules will need to require/import stuff
test.skip('whats the error', () => {
  assert.ok(require('@nodeproto/configproto/flowconfig'));
});

test.run();
