import * as t from '@nodeproto/testproto';

const test = t.suite('@nodeproto/shared: dirnamefilename.mjs');

// TODO: tests not running
test('some test 1', () => {
  test.assert(true === true);
});

test('some test 2', () => {
  test.assert(true === false);
});
