import t from '@nodeproto/configproto/test';
const { suite, assert } = t;

const test = suite('wtf:import');

test('imports', async () => {
  const fsprotoExpected = [
    'fsproto',
    'getFsproto',
    'isMain',
    'memfsproto',
    'parentUri',
    'resolve',
  ];

  assert.hasAllKeys(
    await import('@nodeproto/wtf/fsproto'),
    fsprotoExpected
  );

  const dirsExpected = [
    'dirs',
    'getDirs',
  ];
  assert.hasAllKeys(
    await import('@nodeproto/wtf/dirs'),
    dirsExpected
  );

  assert.hasAllKeys(
    await import('@nodeproto/wtf'),
    fsprotoExpected.concat(dirsExpected)
  );
});

test.run();
