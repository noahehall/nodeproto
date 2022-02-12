import * as t from '@nodeproto/testproto/t';
import http from 'http';

import { baseEsbuildConfig } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('create.esbuild.config');

test.before.each((context) => {
  const baseEsbuildOptions = {
    entry: './src/fixtures/esm.mjs',
  };
});

test('baseEsbuildConfig', () => {
  assert(true === true);
});

test.run();

// const getConfig = (props) => ({
//   entry: '',
//   outdir: '',
//   pkgJson: '',

//   ...props,
// });

// test('is okay', () => {
//   assert.isObject(baseEsbuildConfig(getConfig()));
// });

// test('throws', () => {
//   let props = getConfig();
//   delete props.entry;

//   assert.throws(() => baseEsbuildConfig(props), /entry: string: is required/);

//   props = getConfig();
//   delete props.outdir;

//   assert.throws(() => baseEsbuildConfig(props), /outdir: string: is required/);

//   props = getConfig();
//   delete props.pkgJson;

//   assert.throws(() => baseEsbuildConfig(props), /pkgJson: json: is required/);
// });
