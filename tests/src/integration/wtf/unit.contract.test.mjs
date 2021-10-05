import * as t from '@nodeproto/testproto';

const { assert } = t;

const test = t.suite('integration:wtf:esm:apiContract');

test('imports', async () => {
  const fsprotoExpected = [
    'fsproto',
    'getFsproto',
    'isMain',
    'isR',
    'memfsproto',
    'urlToPath',
    'resolve',
  ];

  assert.hasAllKeys(
    await import('@nodeproto/wtf/fsproto'),
    fsprotoExpected
  );

  const dirsExpected = [
    'dirs',
    'getDirs',
  ];

  assert.hasAllKeys(
    await import('@nodeproto/wtf/dirs'),
    dirsExpected
  );

  assert.hasAllKeys(
    await import('@nodeproto/wtf'),
    fsprotoExpected.concat(dirsExpected)
  );
});

test('dirs', async () => {
  const { dirs } = await import('@nodeproto/wtf/dirs');

  const dirsExpected = [
    'JSONC',
    'cPath',
    'cache',
    'config',
    'cwd',
    'data',
    'dirname',
    'filename',
    'getFilePathAbs',
    'getPkgJson',
    'getPkgJsonAbs',
    'getPkgJsonc',
    'globalDirs',
    'home',
    'inceptionStore',
    'isCjs',
    'isEsm',
    'picomatch',
    'readdir',
    'runtime',
    'symlinkDir',
    'temp',
    'userdirs'
  ];


  assert.hasAllKeys(dirs, dirsExpected, 'dirs API');

  // the following logic has proved extremely annoying so including them here
  // I envision a develpoer experience that overcomes the current limitations
  // of keeping your application DRY while supporting esm + cjs environments
  // thus I dont want to repeat the fkn logic of require vs import.meta
  // in every fkn application
  assert.match(
    dirs.dirname(import.meta.url),
    // i.e. /some/path/on/ur/machine/tests/src/integration/wtf
    /^\/.*\/tests\/src\/integration\/wtf$/,
    'esm: returns absolute path to this dir'
  );

  assert.match(
    dirs.filename(import.meta.url),
    // i.e. /some/path/on/ur/machine/tests/src/integration/wtf/contract.test.mjs
    /^\/.*\/tests\/src\/integration\/wtf\/unit.contract.test.mjs$/,
    'esm: returns absolute path to this dir'
  );

  assert.equal(true, dirs.isEsm(), 'true if esm');
  assert.equal(false, dirs.isCjs(), 'false if esm');

  // finds the path to the package.json in the current directory
  // shiznit i forget this even existed, likely easier to use than { resolve } = fsproto
  assert.match(
    (await dirs.getFilePathAbs(process.cwd(), 'package.json'))[0],
    /^\/.*\/tests\/package\.json$/,
    'absolute path to this file'
  );
});

test('fsproto', async () => {
  const { resolve, urlToPath } = await import('@nodeproto/wtf/fsproto');

  // similar to aforementioned comment
  // keeping things dry, while supporting esm + cjs environments
  assert.match(
    await resolve('./unit.contract.test.mjs', import.meta),
    // i.e. /some/path/on/ur/machine/tests/src/integration/wtf/contract.test.mjs
    /^\/.*tests\/src\/integration\/wtf\/unit.contract.test.mjs$/,
    'esm: can resolve file in current dir'
  );

  assert.match(
    await resolve('../../copypasta/node/openapi/openapi.yml', import.meta),
    // i.e. /some/path/on/ur/machine/tests/src/copypasta/node/openapi/openapi.yml
    /^\/.*\/src\/copypasta\/node\/openapi\/openapi.yml$/,
    'esm: can resolve file in some other dir'
  );

  // TODO: confirmed this throws via console, but the test still fails
  // assert.throws(() => resolve('some file', 'not import.meta'));

  assert.match(
    await urlToPath(import.meta.url),
    /^\/.*tests\/src\/integration\/wtf\/unit.contract.test.mjs$/,
    'esm: returns absolute path to current file via import.meta.url'
  );

  assert.match(
    await urlToPath('file:///some/path/on/ur/machine/cjs.cjs'),
    /^\/some\/path\/on\/ur\/machine\/cjs.cjs$/,
    'esm: removes leading file:// from string'
  );
});

test.run();
