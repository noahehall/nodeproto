import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const test = suite('wtf:import');

test('imports', async () => {
  assert.type(
    await import('@nodeproto/wtf/fsproto'),
    'object',
    'import @nodeproto/wtf/fsproto'
  );

  assert.type(
    await import('@nodeproto/wtf/dirs'),
    'object',
    'import @nodeproto/wtf/dirs'
  );

  assert.type(
    await import('@nodeproto/wtf'),
    'object',
    'import @nodeproto/wtf'
  );

  const
    wtf = await import('@nodeproto/wtf'),
    fsproto = await import('@nodeproto/wtf/fsproto'),
    dirs = await import('@nodeproto/wtf/dirs')
  ;

  const wtfExports = Object.keys(wtf);

  assert.is(
    Object.keys(fsproto).every(fsprotoExport => wtfExports.includes(fsprotoExport)),
    true,
    'wtf contains all of fsproto exports'
  );

  assert.is(
    Object.keys(dirs).every(dirsExport => wtfExports.includes(dirsExport)),
    true,
    'wtf contains all of fsproto exports'
  );
});

// figure out what the actual error is
// while not directly importable via node code
// various modules will need to require/import stuff
test.skip('whats the error', () => {
  assert.ok(require('@nodeproto/configproto/flowconfig'));
});

test.run();
