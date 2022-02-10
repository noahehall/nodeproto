import * as t from '@nodeproto/testproto/t';

const test = t.suite('@nodeproto/jsync: getFiles.mjs');

import {
  childPkgJsonPath,
  childPkgJsonPromise,
  diskPath,
  getFiles,
  getRootPkgJson,
  internalConfigPromise,
} from '@nodeproto/jsync/getFiles';

const { assert } = t;

test('diskPath', () => {
  assert.isTrue(diskPath.startsWith('/'));
  assert.isTrue(diskPath.endsWith('nodeproto/packages/tools/jsync'));
});

test('childPkgJsonPath', () => {
  assert.isTrue(childPkgJsonPath.startsWith('/'));
  assert.isTrue(childPkgJsonPath.endsWith('nodeproto/packages/tools/jsync'));
});

test('internalConfigPromise', async () => {
  const internalConfig = await internalConfigPromise;

  assert.isObject(internalConfig);
  assert.hasAllKeys(internalConfig.file.jsync, [
    'defaultAction',
    'forceRootValues',
    'ignoreRootValues',
    'maxLookups',
    'root',
    'spreadRootValues',
  ]);
});

test('childPkgJsonPromise', async () => {
  assert.isObject(await childPkgJsonPromise);
  assert.isTrue((await childPkgJsonPromise).path.endsWith('package.json'));
  assert.equal((await childPkgJsonPromise).file.name, '@nodeproto/jsync');
});

test('getRootPkgJson', async () => {
  const { file: json, path: jsonPath } = await getRootPkgJson({
    maxLookups: 3,
    currentDir: process.cwd(),
  });

  assert.isObject(json);
  assert.equal(json.name, 'nodeproto');
  assert.isString(jsonPath);

  getRootPkgJson({ maxLookups: -1, currentDir: 'somedir' }).catch((e) => {
    assert.equal(e.message, 'unable to find root package.json, ending search in somedir');
  });
});

test('getFiles', async () => {
  const { config, rootJson, childJson } = await getFiles();

  assert.isObject(config);
  assert.hasAllKeys(config, [
    'defaultAction',
    'forceRootValues',
    'ignoreRootValues',
    'maxLookups',
    'root',
    'spreadRootValues',
  ]);
});

test.run();
