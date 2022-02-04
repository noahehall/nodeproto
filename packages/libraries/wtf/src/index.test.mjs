import * as t from '@nodeproto/testproto/t';

import * as wtf from '@nodeproto/wtf';

const { assert } = t;

const test = t.suite('@nodeproto/wtf: root/index.mjs');

test('@nodeproto/wtf', () => {
  assert.hasAllKeys(
    wtf,
    [
      'dirs',
      'esMain',
      'fsproto',
      'getDirs',
      'getFsproto',
      'isMain',
      'memfsproto',
      'resolve',
      'stripExt',
      'urlToPath',
    ],
    'wtf interface contract'
  );
});

test.run();
