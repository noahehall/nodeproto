import * as t from '@nodeproto/testproto/t';

import { throwIt } from '@nodeproto/shared';

const test = t.suite('@nodeproto/shared: errors.mjs');

const { assert } = t;

test('throwIt', () => {
  assert.throws(() => {
    throwIt('throws error with msg');
  }, 'throws error with msg');

  assert.throws(() => {
    throwIt(new Error('throws error with msg'));
  }, 'throws error with msg');
});

test.run();
