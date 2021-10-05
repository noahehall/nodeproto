const t = require('@nodeproto/testproto');

const { assert } = t;

const test = t.suite('integration:envproto:cjs:apiContract');

test('imports', async () => {
  const envprotoExpected = [
    "_parsed",
    "parsed",
    "ref",
    'buildEnv',
    'clearBaseEnv',
    'getConditions',
    'getDevCert',
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
