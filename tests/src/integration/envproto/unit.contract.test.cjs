import * as t from '@nodeproto/testproto';

const { assert } = t;

const test = t.suite('integration:envproto:esm:apiContract');

test('imports', async () => {
  const envprotoExpected = [
    'buildEnv',
    'clearBaseEnv',
    'getConditions',
    'getDevCert',
    'parsed',
    'syncConfigWithEnv',
    'syncEnvAndConfig',
    'syncEnvWithConfig',
    'updateBaseEnv',
    'wrapValue'
  ];

  assert.hasAllKeys(
    await import('@nodeproto/envproto'),
    envprotoExpected
  );
  // TODO: only testing the default import
});

test.run();
