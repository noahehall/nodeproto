// import * as t from '@nodeproto/testproto';
// import { createEsbuildConfig } from './create.esbuild.config';

// const { assert } = t;

// const test = t.suite('create.esbuild.config');

// const getConfig = (props) => ({
//   entry: '',
//   outdir: '',
//   pkgJson: '',

//   ...props,
// });

// test('is okay', () => {
//   assert.isObject(createEsbuildConfig(getConfig()));
// });

// test('throws', () => {
//   let props = getConfig();
//   delete props.entry;

//   assert.throws(() => createEsbuildConfig(props), /entry: string: is required/);

//   props = getConfig();
//   delete props.outdir;

//   assert.throws(() => createEsbuildConfig(props), /outdir: string: is required/);

//   props = getConfig();
//   delete props.pkgJson;

//   assert.throws(() => createEsbuildConfig(props), /pkgJson: json: is required/);
// });

// test.run();
