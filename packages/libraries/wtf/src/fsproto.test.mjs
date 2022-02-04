import * as t from '@nodeproto/testproto/t';

import { fsproto, getFsproto, isMain, memfsproto, resolve, urlToPath } from '@nodeproto/wtf';

const { assert } = t;

const test = t.suite('@nodeproto/wtf: fsproto.mjs');

test('isMain', () => {
  // save cjs test for integration tests in root/tests dir
  assert.equal(isMain(import.meta), false);
});

test('urlToPath', () => {
  assert.equal(urlToPath('file:///foo/bar'), '/foo/bar');

  assert.equal(
    urlToPath(import.meta.url).endsWith('/nodeproto/packages/libraries/wtf/src/fsproto.test.mjs'),
    true
  );
});

test('resolve', async () => {
  assert.equal(
    (await resolve('./fsproto.mjs', import.meta)).endsWith(
      '/nodeproto/packages/libraries/wtf/src/fsproto.mjs'
    ),
    true
  );

  const fakeFilePath = './poop.mjs';
  assert.equal(await resolve(fakeFilePath, import.meta), '');

  resolve(fakeFilePath, import.meta, true)
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, fakeFilePath));

  resolve(fakeFilePath, true)
    .then(() => assert.fail('should not resolve'))
    .catch((e) => assert.match(e.message, fakeFilePath));
  // save cjs test for integration tests in root/tests dir
});

test('getFsproto', () => {
  const interfaceContract = [
    'fs',
    'readFile',
    'readFiles',
    'readFileSync',
    'writeFile',
    'writeFiles',
  ];

  // when persisting to disk
  assert.hasAllKeys(getFsproto(true), interfaceContract);
  assert.hasAllKeys(fsproto, interfaceContract);

  // when persisting to memory
  assert.hasAllKeys(getFsproto(false), interfaceContract);
  assert.hasAllKeys(memfsproto, interfaceContract);

  // TODO: testing writing & reading files to/from disk/memory
});

test.run();
