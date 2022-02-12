import * as t from '@nodeproto/testproto/t';

import { getDevCert } from '@nodeproto/envproto';

const { assert } = t;

const test = t.suite('@nodeproto/envproto/ssl');

// TODO: complete tests
test('getDevCert', async () => {
  const certs = Object.entries(await getDevCert());

  assert.lengthOf(certs, 4, 'returns 4 certs');
  certs.forEach(([cert, value]) => {
    assert.equal(value.length > 0, true, `${cert} is not empty`);
  });
});

// TODO: needs to test certs are saved to disk
test.run();
