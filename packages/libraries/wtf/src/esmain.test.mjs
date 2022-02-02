import * as t from '@nodeproto/testproto/t';

import { esMain, stripExt } from '@nodeproto/wtf';

const { assert } = t;

const test = t.suite('@nodeproto/wtf: esmain.mjs');

test('stripExt', () => {
  assert.equal(stripExt('js.js'), 'js');
  assert.equal(stripExt('js'), 'js');
});

test('esMain', () => {
  // complete truthy test in integration tests in root/tests dir
  assert.equal(esMain(import.meta.url), false);
});

test.run();
