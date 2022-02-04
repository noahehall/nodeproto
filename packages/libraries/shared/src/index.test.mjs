import * as t from '@nodeproto/testproto/t';

import * as opsproto from '@nodeproto/shared/opsproto';
import * as shared from '@nodeproto/shared';
import * as wtf from '@nodeproto/shared/wtf';

const { assert } = t;

const test = t.suite('@nodeproto/shared: root/index.mjs');

test('@nodeproto/shared', () => {
  const opsprotoContract = [
    'isArray',
    'isBoolean',
    'isDate',
    'isError',
    'isFunction',
    'isMap',
    'isNaN',
    'isNull',
    'isNumber',
    'isObject',
    'isPromise',
    'isRegExp',
    'isSet',
    'isString',
    'isSymbol',
    'isUndefined',
    'isValue',
    'isWeakMap',
    'isWeakSet',
    'logIt',
    'noop',
    'sortArraysAndObjects',
    'sortObject',
    'sortSimpleThenComplexDataTypes',
    'throwIt',
  ];
  const wtfContract = [
    'dirname',
    'external',
    'filename',
    'getFilePathAbs',
    'getPkgJson',
    'getPkgJsonAbs',
    'getPkgJsonc',
    'isCjs',
    'isEsm',
    'readdir',
  ];
  const sharedContract = ['opsproto', 'wtf'].concat(opsprotoContract, wtfContract);

  assert.hasAllKeys(opsproto, opsprotoContract, 'opsproto interface contract');
  assert.hasAllKeys(wtf, wtfContract, 'wtf interface contract');
  assert.hasAllKeys(shared, sharedContract, 'shared');
});

test.run();
