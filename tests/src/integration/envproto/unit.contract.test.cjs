const t = require('@nodeproto/testproto');

const { assert } = t;

const test = t.suite('integration:envproto:cjs:apiContract');

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
    require('@nodeproto/envproto'),
    envprotoExpected
  );
  // TODO: only testing the default import
});

test.run();
