import t from '@nodeproto/configproto/test';
const { suite, assert } = t;

const test = suite('envproto:imports');

test('imports', async () => {
  assert.hasAllKeys(
    await import('@nodeproto/envproto'),
    [
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
    ]
  );
});

test.run();
