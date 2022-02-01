import * as t from '@nodeproto/testproto/t';

import {
  getFieldCategories,
  getJsonFieldCategory,
  segmentJsonFieldsByCategory,
  syncJsonFields,
  syncJsonFiles,
} from '@nodeproto/jsync/syncFiles';

import * as c from '@nodeproto/jsync/constants';

const test = t.suite('@nodeproto/jsync: syncfiles.mjs');

const { assert } = t;

test.before.each((context) => {
  const SPREAD_VALUES = ['name', 'version'];
  const FORCE_VALUES = ['dependencies', 'devDependencies'];
  const IGNORE_VALUES = ['scripts', 'jsync'];

  const jsyncFieldCategories = {
    [c.SPREAD_VALUES]: new Set(SPREAD_VALUES),
    [c.FORCE_VALUES]: new Set(FORCE_VALUES),
    [c.IGNORE_VALUES]: new Set(IGNORE_VALUES),
  };

  const jsyncConfig = {
    [c.SPREAD_VALUES]: SPREAD_VALUES,
    [c.FORCE_VALUES]: FORCE_VALUES,
    [c.IGNORE_VALUES]: IGNORE_VALUES,
  };

  const rootJsyncConfig = {
    [c.SPREAD_VALUES]: ['name', '*'],
  };

  const fieldNames = SPREAD_VALUES.concat(FORCE_VALUES, IGNORE_VALUES);

  context.fixtures = {
    fieldNames,
    FORCE_VALUES,
    IGNORE_VALUES,
    jsyncConfig,
    jsyncFieldCategories,
    rootJsyncConfig,
    SPREAD_VALUES,
  };

  Object.freeze(context.fixtures);
});

test.after.each((context) => {
  delete context.fixtures;
});

test('getJsonFieldCategory', (context) => {
  const { jsyncFieldCategories, SPREAD_VALUES, FORCE_VALUES, IGNORE_VALUES } = context.fixtures;

  SPREAD_VALUES.forEach((field) => {
    assert.equal(getJsonFieldCategory(jsyncFieldCategories, field), c.SPREAD_VALUES);
  });

  FORCE_VALUES.forEach((field) => {
    assert.equal(getJsonFieldCategory(jsyncFieldCategories, field), c.FORCE_VALUES);
  });

  IGNORE_VALUES.concat('extra field not in config').forEach((field) => {
    assert.equal(getJsonFieldCategory(jsyncFieldCategories, field), c.IGNORE_VALUES);
  });
});

test('getFieldCategories', (context) => {
  assert.deepEqual(
    getFieldCategories(context.fixtures.jsyncConfig),
    context.fixtures.jsyncFieldCategories
  );
});

test('segmentJsonFieldsByCategory', (context) => {
  const { fieldCategories, jsyncFieldCategories } = segmentJsonFieldsByCategory({
    fieldNames: context.fixtures.fieldNames,
    rootJsyncConfig: context.fixtures.rootJsyncConfig,
    defaultJsyncConfig: context.fixtures.jsyncConfig,
  });

  console.info('\n\n wtf', fieldCategories);

  assert.sameMembers(fieldCategories[c.SPREAD_VALUES], ['name']);
  assert.sameMembers(fieldCategories[c.FORCE_VALUES], context.fixtures.FORCE_VALUES);
  assert.sameMembers(fieldCategories[c.IGNORE_VALUES], ['version', 'scripts', 'jsync']);
});
test.run();
