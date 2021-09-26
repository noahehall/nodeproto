import { getDevCert } from './ssl';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const test = suite('@nodeproto/envproto/ssl');

const getOpts = (overrides = {}) => ({
  days: 7,
  domain: undefined,
  selfSigned:  true,
  tmpDir: undefined,

  ...overrides
});

// TODO: complete tests
test('getDevCert', async () => {
  const certs = await getDevCert();

  assert.type(certs.certificate, 'string', 'returns certifcate');
  assert.type(certs.clientKey, 'string', 'returns clientKey');
  assert.type(certs.csr, 'string', 'returns certificate request');
  assert.type(certs.serviceKey, 'string', 'returns private key');
});

test.run();
