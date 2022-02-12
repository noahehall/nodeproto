import * as t from '@nodeproto/testproto/t';

import { pack } from '@nodeproto/buildproto';

const { assert } = t;

const test = t.suite('pack.mjs');

export const getPackInterface = () => [
  'builtinModules',
  'context',
  'ifDev',
  'ifProd',
  'NODE_ENV',
  'pathDist',
  'pathSrc',
  'pkgJson',
  'writeToDisk',
];

test('pack', async () => {
  pack({ context: './not/abs/path' })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.equal(e.message, 'dirpath must be absolute'));

  pack({ context: '/dir/without/package/json' })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, /could not find package.json/));

  const fakeSrc = 'fake/src/path';
  const fakeDist = 'fake/dist/path';

  pack({ PATH_SRC: fakeSrc, PATH_DIST: process.cwd() })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, fakeSrc));

  pack({ PATH_SRC: process.cwd(), PATH_DIST: fakeDist })
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, fakeDist));

  assert.isObject(pack(), 'returns pack object with environment data & fns');

  assert.hasAllKeys(pack, getPackInterface(), 'buildproto pack meta object');
});
