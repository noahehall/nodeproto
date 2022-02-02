import * as t from '@nodeproto/testproto/t';

import { dirs, getDirs } from '@nodeproto/wtf';

const { assert } = t;

const test = t.suite('@nodeproto/wtf: dirs.mjs');

test.before.each((context) => {
  const interfaceContract = [
    'JSONC',
    'cPath',
    'cache',
    'config',
    'cwd',
    'data',
    'dirname',
    'picomatch',
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
    'readdir',
    'runtime',
    'symlinkDir',
    'temp',
    'userdirs',
  ];

  context.fixtures = {
    interfaceContract,
  };
});

test.after.each((context) => {
  delete context.fixtures;
});

test('dirs', ({ fixtures }) => {
  assert.hasAllKeys(dirs, fixtures.interfaceContract, 'matches interface contract');
});

test('getDirs', ({ fixtures }) => {
  assert.hasAllKeys(getDirs(), fixtures.interfaceContract, 'matches interface contract');

  assert.hasAllKeys(
    getDirs({ extraProp: 'extraValue' }),
    fixtures.interfaceContract.concat('extraProp'),
    'matches interface contract with overrides'
  );
});

test.run();
