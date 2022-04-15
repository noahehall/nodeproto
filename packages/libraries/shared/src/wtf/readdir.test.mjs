import * as t from '@nodeproto/testproto/t';

import {
  dirname,
  external,
  getFilePathAbs,
  getPkgJson,
  getPkgJsonAbs,
  getPkgJsonc,
  readdir,
} from '@nodeproto/shared/wtf';

const test = t.suite('@nodeproto/shared: readdir.mjs');

const { assert } = t;

const getFixturesDirPath = () => dirname(import.meta.url) + '/fixtures';

test('external', () => {
  const externalMembers = Object.keys(external);
  assert.lengthOf(externalMembers, 2, 'external has 2 members');
  assert.include(externalMembers, 'picomatch', 'external has picomatch');
  assert.include(externalMembers, 'JSONC', 'external has JSONC');
});

test('getFilePathAbs', async () => {
  const fixturesPath = getFixturesDirPath();

  const filePathAbs = await getFilePathAbs(fixturesPath, '*.cjs');

  assert.lengthOf(filePathAbs, 1, 'filePathAbs has 1 item');
  assert.equal(filePathAbs[0], fixturesPath + '/cjs.cjs', 'finds cjs file');
});

test('getPkgJson', async () => {
  const pkgJson = await getPkgJson(getFixturesDirPath(), 'package.json');

  assert.equal(typeof pkgJson, 'object', 'pkgJson is object');
  assert.equal(typeof pkgJson.path, 'string', 'pkgJson.path is string');
  assert.equal(pkgJson.file.name, 'package.json', 'pkgJson.file.name is package.json');
});

test('getPkgJsonAbs', async () => {
  const pkgJson = await getPkgJsonAbs(getFixturesDirPath(), 'package.json');

  assert.equal(typeof pkgJson, 'string', 'pkgJson is string');
  assert.equal(pkgJson.startsWith('/'), true, 'pkgJson is absolute path');
  assert.equal(pkgJson.endsWith('/package.json'), true, 'pkgJson ends with /package.json');
});

test('getPkgJsonc', async () => {
  const pkgJsonc = await getPkgJsonc(getFixturesDirPath());

  assert.equal(typeof pkgJsonc, 'object', 'pkgJsonc is object');
  assert.equal(typeof pkgJsonc.path, 'string', 'pkgJsonc.path is string');
  assert.equal(pkgJsonc.file.name, 'package.jsonc', 'pkgJsonc.file.name is package.jsonc');
});

test('readdir', async () => {
  const files = await readdir({ dirpath: getFixturesDirPath() });

  assert.lengthOf(files, 4, 'files has 4 items matching contents of fixtures dir');
});

test.run();
