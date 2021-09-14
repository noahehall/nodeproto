import { getDevCert } from './ssl.mjs';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const test = suite('ssl.mjs');

test('getDevCert', () => {
  getDevCert();

  assert.is(true, false, 'need to add tests');
});

test.run();
