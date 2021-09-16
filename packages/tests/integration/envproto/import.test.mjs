import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const test = suite('envproto:imports');

test('imports', async () => {
  assert.type(
    await import('@nodeproto/envproto'),
    'object',
    'import @nodeproto/envproto'
  );
});

// figure out what the actual error is
// while not directly importable via node code
// various modules will need to require/import stuff
test.skip('whats the error', async () => {
  assert.ok(await import('@nodeproto/configproto/flowconfig'));
});

test.run();
