import * as t from '@nodeproto/testproto/t';

import { dirname, filename } from '@nodeproto/shared/wtf';

const test = t.suite('@nodeproto/shared: dirnamefilename.mjs');

const { assert } = t;

test('filename', () => {
  const thisFile = filename(import.meta.url);

  assert.equal(thisFile.startsWith('/'), true, 'is absolute path');
  assert.equal(
    thisFile.endsWith('/nodeproto/packages/libraries/shared/src/wtf/dirnamefilename.test.mjs'),
    true,
    'ends with path starting from repo root'
  );
});

test('dirname', () => {
  const thisDir = dirname(import.meta.url);

  assert.equal(thisDir.startsWith('/'), true, 'is absolute path');
  assert.equal(
    thisDir.endsWith('/nodeproto/packages/libraries/shared/src/wtf'),
    true,
    'ends with path starting from repo root'
  );
});

test.run();
