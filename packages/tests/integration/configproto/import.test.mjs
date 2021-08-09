import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const test = suite('configproto:import');

// hacky test to assert importable via normal import resolution
test('babel', () => {
  assert.throws(
    () => require('@nodeproto/configproto/babel/base'),
    /Unexpected token/,
    'import base.babelrc'
  );

  assert.throws(
    () => require('@nodeproto/configproto/babel/client'),
    /Unexpected token/,
    'import client.babelrc'
  );

  assert.throws(
    () => require('@nodeproto/configproto/babel/flow'),
    /Unexpected token/,
    'import flow.baberc'
  );

  assert.throws(
    () => require('@nodeproto/configproto/babel/node'),
    /Unexpected token/,
    'import node.babelrc'
  );

  // TODO: need a real integration test for this
  assert.throws(
    () => require('@nodeproto/configproto/babel/ssr'),
    /Unexpected token/,
    'import ssr.babelrc'
  );
});

// hacky test to assert importable via normal resolution
test('browserslist', () => {
  assert.throws(
    () => require('@nodeproto/configproto/browserslist'),
    /Invalid or unexpected token/,
    'import browsreslist'
  );
});

// TODO: havent converted esbuild yet
test.skip('esbuild', async () => {
  assert.type(
    await import('@nodeproto/configproto/esbuild/backend'),
    'object',
    'import backend.esbuild.config.mjs'
  );

  assert.type(
    await import('@nodeproto/configproto/esbuild/library'),
    'object',
    'import library.esbuild.config.mjs'
  );

  // TODO: assert /esbuild exports an object containing both library & backend configs
});

// hacky test to assert importable via normal resolution
test('eslint', () => {
  assert.throws(
    () => require('@nodeproto/configproto/eslint'),
    /Invalid or unexpected token/,
    'import base.eslintrc.yml'
  );
});

// hacky test to assert importable via normal resolution
test('flowconfig', () => {
  assert.throws(
    () => require('@nodeproto/configproto/flowconfig'),
    /Unexpected token/,
    'import flowconfig'
  );
});

// hacky test to assert importable via normal resolution
test('swc', () => {
  assert.throws(
    () => require('@nodeproto/configproto/swc/node'),
    /Unexpected token/,
    'import node.swcrc'
  );
});


test('webpack', async () => {
  assert.type(
    await import('@nodeproto/configproto/webpack/bff/server'),
    'object',
    'import server.webpack.mjs'
  );

  assert.type(
    await import('@nodeproto/configproto/webpack/loader/FlowTypeCleaner'),
    'object',
    'import FlowTypeCleaner.cjs'
  );

  assert.type(
    await import('@nodeproto/configproto/webpack/base'),
    'object',
    'import base.webpack.config.mjs'
  );

  assert.type(
    await import('@nodeproto/configproto/webpack/build'),
    'object',
    'import build.webpack.config.mjs'
  );

  // TODO: need to convert
  // assert.type(
  //   await import('@nodeproto/configproto/webpack/prod'),
  //   'object',
  //   'import prod.webpack.config.mjs'
  // );

  assert.type(
    await import('@nodeproto/configproto/webpack/react.dev'),
    'object',
    'import react.dev.webpack.config.mjs'
  );

  assert.type(
    await import('@nodeproto/configproto/webpack/react.esbuild'),
    'object',
    'import react.esbuild.webpack.config.mjs'
  );

  assert.type(
    await import('@nodeproto/configproto/webpack/setup'),
    'object',
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
