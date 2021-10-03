const t = require('@nodeproto/testproto');

const { assert } = t;

const test = t.suite('integration:wtf:cjs:apiContract');

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
    require('@nodeproto/wtf/fsproto'),
    fsprotoExpected
  );

  const dirsExpected = [
    'dirs',
    'getDirs',
  ];

  assert.hasAllKeys(
    require('@nodeproto/wtf/dirs'),
    dirsExpected
  );

  assert.hasAllKeys(
    require('@nodeproto/wtf'),
    fsprotoExpected.concat(dirsExpected)
  );
});

test('dirs', async () => {
  const { dirs } = require('@nodeproto/wtf/dirs');

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
    'shelljs',
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
    dirs.dirname(__filename), //
    // i.e. /some/path/on/ur/machine/tests/src/integration/wtf
    /^\/.*\/tests\/src\/integration\/wtf$/,
    'cjs: returns absolute path to this dir'
  );

  assert.match(
    dirs.filename(__filename),
    // i.e. /some/path/on/ur/machine/tests/src/integration/wtf/contract.test.cjs
    /^\/.*\/tests\/src\/integration\/wtf\/contract.test.cjs$/,
    'cjs: returns absolute path to this dir'
  );

  assert.equal(false, dirs.isEsm(), 'false if cjs');
  assert.equal(true, dirs.isCjs(), 'true if cjs');

  // finds the path to the package.json in the current directory
  // shiznit i forget this even existed, likely easier to use than { resolve } = fsproto
  assert.match(
    (await dirs.getFilePathAbs(process.cwd(), 'package.json'))[0],
    /^\/.*\/tests\/package\.json$/,
    'absolute path to this file'
  );
});

test('fsproto', async () => {
  const { resolve, urlToPath } = require('@nodeproto/wtf/fsproto');

  // similar to aforementioned comment
  // keeping things dry, while supporting esm + cjs environments
  assert.match(
    await resolve('./contract.test.mjs', __filename),
    // i.e. /some/path/on/ur/machine/tests/src/integration/wtf/contract.test.mjs
    /^\/.*tests\/src\/integration\/wtf\/contract.test.mjs$/,
    'cjs: can resolve file in current dir'
  );

  assert.match(
    await resolve('../../copypasta/node/openapi/openapi.yml', __filename),
    // i.e. file:///some/path/on/ur/machine/tests/src/copypasta/node/openapi/openapi.yml
    /^\/.*\/src\/copypasta\/node\/openapi\/openapi.yml$/,
    'cjs: can resolve file in some other dir'
  );

  // TODO: confirmed this throws via console, but the test still fails
  // assert.throws(() => resolve('some file', 'not import.meta'));

  assert.match(
    await urlToPath('file://' + __filename),
    /^\/.*tests\/src\/integration\/wtf\/contract.test.cjs$/,
    'cjs: returns absolute path to current file via import.meta.url'
  );

  assert.match(
    await urlToPath('file:///some/path/on/ur/machine/cjs.cjs'),
    /^\/some\/path\/on\/ur\/machine\/cjs.cjs$/,
    'esm: removes leading file:// from string'
  );
});

test.run();
