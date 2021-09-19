import { fileURLToPath } from 'url';

import path from 'path';
import reactEsbuildWebpackConfig from './react.esbuild.webpack.config.mjs';
import testCompiler from './test.compiler.mjs';
import t from '#t';

const { assert } = t;

const thisDir = path.dirname(fileURLToPath(import.meta.url));

export const getOpts = (overrides) => ({
  entry: '',
  htmlOptions: {},
  outputDir: thisDir + '/dist',

  ...overrides
});

const test = t.suite('react.esbuild.webpack.config.mjs');

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
  assert.isObject(
    reactEsbuildWebpackConfig(getOpts()),
    'returns config object'
  );
});

test('compilation', async () => {
  const opts = getOpts({
    entry: thisDir + '/fixtures/esm.mjs',
  });

  assert.isObject(
    await testCompiler(reactEsbuildWebpackConfig(opts)),
    'compiles esm successfuly'
  );

  assert.isObject(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/commonjs.cjs',
    })),
    'compiles cjs successfuly'
  );

  assert.isObject(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/react.jsx',
    })),
    'compiles jsx successfuly'
  );

  assert.isObject(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/auto.js',
    })),
    'interprets js and compiles successfuly'
  );

  assert.isObject(
    await testCompiler(reactEsbuildWebpackConfig({
      ...opts,
      entry: thisDir + '/fixtures/flow.mjs',
    })),
    'removes flowtypes and compiles esm successfuly'
  );
});

test.run();
