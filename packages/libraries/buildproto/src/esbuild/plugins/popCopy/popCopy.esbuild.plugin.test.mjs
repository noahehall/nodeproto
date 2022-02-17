import * as t from '@nodeproto/testproto/t';

import {
  baseEsbuildConfig,
  esbuildCompileConfig,
  EsbuildPluginPopCopy,
} from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('popCopy.esbuild.plugin');

test.before.each((context) => {
  const baseEsbuildOptions = {
    entry: './src/fixtures/esm_import_yml.mjs',
    plugins: [new EsbuildPluginPopCopy({ filter: /\.yml$/ })],
  };

  context.fixtures = {
    baseEsbuildOptions,
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('esbuildPluginPopCopy', async ({ fixtures }) => {
  const { baseEsbuildOptions } = fixtures;
  const { config, pack } = await baseEsbuildConfig(baseEsbuildOptions);
  // todo: need to finish this test
  const results = await esbuildCompileConfig(config);

  assert.isTrue(true == true);
});

test.run();

// test.before(async () => {
//   // setup reusable stubs
//   fstubs.fd = Promise.resolve({ close: sinon.stub() });
//   fstubs.negativeInfinity = Promise.resolve({
//     mtimeMs: Number.NEGATIVE_INFINITY,
//   });
//   fstubs.postitiveInfinity = Promise.resolve({
//     mtimeMs: Number.POSITIVE_INFINITY,
//   });
//   fstubs.sourcepath = await resolve('./fixtures/sourcedir/copytooutdir.mjs', import.meta.url);
// });

// // reset test state
// test.after.each(() => sinon.restore());

// test.only('fileShouldCopy: returns latest timestamp for updated sourcepath', async () => {
//   // stubs for this test case
//   fstubs.open = sinon.stub(fs.promises, 'open').returns(fstubs.fd);
//   fstubs.stat = sinon.stub(fs.promises, 'stat').returns(fstubs.postitiveInfinity);

//   // run the unit under test
//   const newmtimems = await popCopy.fileShouldCopy(fstubs.sourcepath);

//   // confirm
//   assert.equal(newmtimems, Number.POSITIVE_INFINITY, 'yes');
// });

// test('fileShouldCopy: returns falsey if sourcepath hasnt been updated', async (t) => {
//   // stub for this test case
//   fstubs.open = sinon.stub(fs.promises, 'open').returns(fstubs.fd);
//   fstubs.stat = sinon.stub(fs.promises, 'stat').returns(fstubs.negativeInfinity);

//   // run the unit under test
//   popCopy.cache.set(fstubs.sourcepath, { ms: Number.POSITIVE_INFINITY });
//   const newmtimems = await popCopy.fileShouldCopy(fstubs.sourcepath);

//   // confirm logic
//   assert.equal(newmtimems, false, 'yes');
// });

// test('fileShouldCopy: closes filehandle and delets sourcepath on error', async (t) => {
//   // stub for this test case
//   fstubs.open = sinon.stub(fs.promises, 'open').throws();
//   fstubs.stat = sinon.stub(fs.promises, 'stat').returns(fstubs.negativeInfinity);

//   // run the unit under test
//   popCopy.cache.set(fstubs.sourcepath, { ms: Number.POSITIVE_INFINITY });
//   const newmtimems = await popCopy.fileShouldCopy(fstubs.sourcepath);

//   // confirm logic
//   assert.throws(newmtimems, false, 'yes');
// });
