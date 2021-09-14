import { fileURLToPath } from 'url';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import path from 'path';
import reactDevWebpackConfig from './react.dev.webpack.config.mjs';
import testCompiler from './test.compiler.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));

export const getOpts = (overrides) => ({
  entry: [],
  htmlOptions: {},
  output: { path: thisDir + '/dist' },
  pathDist: thisDir + '/dist',
  pathSrc: thisDir,

  ...overrides
});

const test = suite('react.dev.webpack.config.mjs');

test('throws', () => {
  let opts = getOpts();
  delete opts.entry;

  assert.throws(
    () => reactDevWebpackConfig(opts),
    /entry: Array: is required/,
    'if missing entry'
  );

  opts = getOpts();
  delete opts.htmlOptions;

  assert.throws(
    () => reactDevWebpackConfig(opts),
    /htmlOptions: is required/,
    'if missing htmlOptions'
  );
});

test('is okay', () => {
  assert.type(
    reactDevWebpackConfig(getOpts()),
    'object',
    'returns config object'
  );
});

test('compilation', async () => {
  const opts = getOpts({
    entry: [thisDir + '/fixtures/esm.mjs'],
  });

  assert.type(
    await testCompiler(reactDevWebpackConfig(opts)),
    'object',
    'compiles esm successfuly'
  );

  assert.type(
    await testCompiler(reactDevWebpackConfig({
      ...opts,
      entry: [thisDir + '/fixtures/commonjs.cjs'],
    })),
    'object',
    'compiles cjs successfuly'
  );

  // TODO: i've never used .jsx extension
  // add @babel/preset-react to base.webpack.config.mjs if that changes
  // assert.type(
  //   await testCompiler(reactDevWebpackConfig({
  //     ...opts,
  //     entry: [thisDir + '/fixtures/react.jsx'],
  //   })),
  //   'object',
  //   'compiles jsx successfuly'
  // );

  assert.type(
    await testCompiler(reactDevWebpackConfig({
      ...opts,
      entry: [thisDir + '/fixtures/auto.js'],
    })),
    'object',
    'interprets js and compiles successfuly'
  );

  assert.type(
    await testCompiler(reactDevWebpackConfig({
      ...opts,
      entry: [thisDir + '/fixtures/flow.mjs'],
    })),
    'object',
    'removes flowtypes and compiles esm successfuly'
  );
});

// help determining what error is
test.skip('throws', () => {
  // this should throw and reveal error in console

  assert.ok(
    reactDevWebpackConfig({ pkgJsonPath: './doesnt.exist.here.json' })
  );
});

test.run();
