import { fileURLToPath } from 'url';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import path from 'path';
import reactEsbuildWebpackConfig from './react.esbuild.webpack.config.mjs';
import testCompiler from './test.compiler.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));

export const getOpts = (overrides) => ({
  entry: '',
  htmlOptions: {},
  outputDir: thisDir + '/dist',

  ...overrides
});

const test = suite('react.esbuild.webpack.config.mjs');

test('throws', () => {
  let opts = getOpts();
  delete opts.entry;

  assert.throws(
    () => reactEsbuildWebpackConfig(opts),
    /entry is required/,
    'if missing entry'
  );

  opts = getOpts();
  delete opts.htmlOptions;

  assert.throws(
    () => reactEsbuildWebpackConfig(opts),
    /htmlOptions is required/,
    'if missing htmlOptions'
  );

  opts = getOpts();
  delete opts.outputDir;

  assert.throws(
    () => reactEsbuildWebpackConfig(opts),
    /outputDir is required/,
    'if missing outputDir'
  );
});

test('is okay', () => {
  assert.type(
    reactEsbuildWebpackConfig(getOpts()),
    'object',
    'returns config object'
  );
});

test('compilation', async () => {
  const opts = getOpts({
    entry: thisDir + '/fixtures/esm.mjs',
  });

  assert.type(
    await testCompiler(reactEsbuildWebpackConfig(opts)),
    'object',
    'compiles esm successfuly'
  );

  assert.type(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/commonjs.cjs',
    })),
    'object',
    'compiles cjs successfuly'
  );

  assert.type(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/react.jsx',
    })),
    'object',
    'compiles jsx successfuly'
  );

  assert.type(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/auto.js',
    })),
    'object',
    'interprets js and compiles successfuly'
  );

  assert.type(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/flow.mjs',
    })),
    'object',
    'removes flowtypes and compiles esm successfuly'
  );
});

// help determining what error is
test.skip('throws', () => {
  // this should throw and reveal error in console
  assert.ok(
    reactEsbuildWebpackConfig({ pkgJsonPath: './doesnt.exist.here.json' })
  );
});

test.run();
