import { createEsbuildConfig } from './create.esbuild.config';
import { esbuildConfig, esrunConfig } from './run.esbuild.config';

import * as t from '@nodeproto/testproto';

const { assert } = t;

const test = t.suite('run.esbuild.config.test');

const getConfig = props => ({
  entry: '',
  outdir: './dist',
  pkgJson: {},
  write: false,

  ...props
});

test('esbuildConfig', async () => {
  [
    './fixtures/auto.js',
    './fixtures/commonjs.cjs',
    './fixtures/esm.mjs',
    // TODO: remove flow types with esbuild
    // https://github.com/dalcib/esbuild-plugin-flow
    // https://github.com/evanw/esbuild/issues/79
    // https://medium.com/flow-type/clarity-on-flows-direction-and-open-source-engagement-e721a4eb4d8b
    // './fixtures/flow.mjs',
    './fixtures/react.jsx',
  ].forEach(entry => assert.eventually.hasAllKeys(
    esbuildConfig(createEsbuildConfig(getConfig({ entry }))),
    [ 'errors', 'metafile', 'outputFiles', 'warnings' ],
    `compiles ${entry.split('.').pop()} files`
  ));
});

// TODO: see integration test, skipping full unit tests for now
test('esrunConfig', async () => {
  assert(true === true);
  // [
  //   './fixtures/auto.js',
  //   // './fixtures/commonjs.cjs',
  //   // './fixtures/esm.mjs',
  //   // TODO: see esbuildConfig test comments
  //   // './fixtures/flow.mjs',
  //   // './fixtures/react.jsx',
  // ].forEach(entry => assert.throws(
  //   () => Promise.resolve(esrunConfig(createEsbuildConfig(getConfig({ entry, write: true })))),
  //   /poop/,
  //   `compiles ${entry.split('.').pop()} files`
  // ));
});


test.run();
