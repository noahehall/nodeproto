import * as t from '@nodeproto/testproto/t';

const test = t.suite('@nodeproto/jsync: getFiles.mjs');

import {
  childPkgJson,
  childPkgJsonPath,
  diskPath,
  getJsyncConfig,
  getRootPkgJson,
  JSYNC_CONFIG,
} from '@nodeproto/jsync/getFiles';

const { assert } = t;

test('diskPath', () => {
  assert.isTrue(diskPath.startsWith('/'));
  assert.isTrue(diskPath.endsWith('nodeproto/packages/tools/jsync'));
});

test('JSYNC_CONFIG', async () => {
  assert.isObject(await JSYNC_CONFIG);
  assert.hasAllKeys(await JSYNC_CONFIG, [
    'forceRootValues',
    'ignoreRootValues',
    'maxLookups',
    'root',
    'spreadRootValues',
  ]);
});

test('getRootPkgJson', async () => {
  const { json, jsonPath } = await getRootPkgJson({
    maxLookups: 10,
    currentDir: process.cwd(),
  });

  assert.isObject(json);
  assert.equal(json.name, 'nodeproto');
  assert.isString(jsonPath);

  getRootPkgJson({ maxLookups: 0 }).catch((e) => {
    assert.equal(e.message, 'unable to find root packageFile in getRootPkgJson');
  });
});

test('childPkgJsonPath', () => {
  assert.isTrue(childPkgJsonPath.startsWith('/'));
  assert.isTrue(childPkgJsonPath.endsWith('nodeproto/packages/tools/jsync'));
});

test('childPkgJson', async () => {
  assert.isObject(await childPkgJson);
  assert.isTrue(await childPkgJson.path.endsWith('package.json'));
  assert.equal(await childPkgJson.file.name, '@nodeproto/jsync');
});

test('getJsyncConfig', () => {
  const config = getJsyncConfig();

  assert.isObject(config);
  assert.hasAllKeys(config, [
    'DEFAULT_CATEGORY',
    'forceRootValues',
    'ignoreRootValues',
    'maxLookups',
    'root',
    'spreadRootValues',
  ]);
});

test.run();
