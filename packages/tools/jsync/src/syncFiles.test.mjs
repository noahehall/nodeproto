/* eslint-disable  sort-keys */
import * as t from '@nodeproto/testproto/t';

import {
  availableActions,
  getFieldCategories,
  getFieldCategory,
  getFieldsByCategory,
  syncFields,
  syncFiles,
} from '@nodeproto/jsync/syncFiles';

import { FORCE_VALUES, IGNORE_VALUES, SPREAD_VALUES } from '@nodeproto/jsync/constants';

const test = t.suite('@nodeproto/jsync: syncfiles.mjs');

const { assert } = t;

test.before.each((context) => {
  const rootJson = {
    unknownRootField: 'rootValue',
    author: 'rootValue',
    version: 'rootValue',
    name: 'rootValue',
    exports: 'rootValue',
    dependencies: {
      root: 'rootValue',
      commonField: 'rootValue',
    },
    scripts: ['rootValue', 'commonValue'],
  };

  const childJson = {
    unknownChildField: 'childValue',
    author: 'childValue',
    version: 'childValue',
    name: 'childValue',
    exports: 'childValue',
    dependencies: {
      child: 'childValue',
      commonField: 'childValue',
    },
    scripts: ['childValue', 'commonValue'],
  };

  const syncedFields = {
    // force
    author: 'rootValue',
    version: 'rootValue',
    // spread
    dependencies: {
      child: 'childValue',
      commonField: 'rootValue',
      root: 'rootValue',
    },
    // spread (set)
    scripts: ['rootValue', 'commonValue', 'childValue'],
  };

  // simulates the package.json.jsync object
  const config = {
    [FORCE_VALUES]: ['author', 'version'],
    [IGNORE_VALUES]: ['name', 'exports', 'jsync'],
    [SPREAD_VALUES]: ['dependencies', 'scripts'],
  };

  const fieldCategories = {
    [SPREAD_VALUES]: new Set(config[SPREAD_VALUES]),
    [FORCE_VALUES]: new Set(config[FORCE_VALUES]),
    [IGNORE_VALUES]: new Set(config[IGNORE_VALUES]),
  };

  const fieldsByCategory = Object.entries(config).reduce(
    (acc, [category, fields]) =>
      Object.assign(
        acc,
        fields.reduce((acc2, field) => Object.assign(acc2, { [field]: category }), {})
      ),
    {}
  );

  context.fixtures = {
    childJson,
    config: { ...config, defaultAction: SPREAD_VALUES },
    fieldCategories,
    fieldsByCategory,
    rootJson,
    syncedFields,
  };

  Object.freeze(context.fixtures);
});

test.after.each((context) => {
  delete context.fixtures;
});

test('availableActions', () => {
  assert.equal(availableActions.size, 3);
  assert.deepEqual(availableActions, new Set([FORCE_VALUES, IGNORE_VALUES, SPREAD_VALUES]));
});

test('getFieldCategories', ({ fixtures }) => {
  assert.deepEqual(
    getFieldCategories(fixtures.config),
    fixtures.fieldCategories,
    'should match expected field categories'
  );

  const fieldToIgnore = 'always ignore this field';
  const ignoreResult = getFieldCategories({
    ...fixtures.config,
    [FORCE_VALUES]: [...fixtures.config[FORCE_VALUES], fieldToIgnore],
    [IGNORE_VALUES]: [...fixtures.config[IGNORE_VALUES], fieldToIgnore],
    [SPREAD_VALUES]: [...fixtures.config[SPREAD_VALUES], fieldToIgnore],
  });
  assert.deepEqual(
    ignoreResult[IGNORE_VALUES],
    new Set([...fixtures.config[IGNORE_VALUES], fieldToIgnore]),
    'should ignore fields that are in both force and ignore'
  );
  assert.deepEqual(
    ignoreResult[FORCE_VALUES],
    fixtures.fieldCategories[FORCE_VALUES],
    'should remove fields in force if they exist in ignore'
  );
  assert.deepEqual(
    ignoreResult[SPREAD_VALUES],
    fixtures.fieldCategories[SPREAD_VALUES],
    'should remove fields in spread if they exist in ignore'
  );

  const fieldToForce = 'force takes precedence over spread';
  const result = getFieldCategories({
    ...fixtures.config,
    [FORCE_VALUES]: [...fixtures.config[FORCE_VALUES], fieldToForce],
    [SPREAD_VALUES]: [...fixtures.config[SPREAD_VALUES], fieldToForce],
  });
  assert.deepEqual(
    result[FORCE_VALUES],
    new Set([...fixtures.config[FORCE_VALUES], fieldToForce]),
    'should match expected result'
  );
  assert.deepEqual(
    result[IGNORE_VALUES],
    fixtures.fieldCategories[IGNORE_VALUES],
    'should not modify ignore field'
  );
  assert.deepEqual(
    result[SPREAD_VALUES],
    fixtures.fieldCategories[SPREAD_VALUES],
    'should remove fields in spread if they exist in force'
  );
});

test('getFieldCategory', ({ fixtures }) => {
  const { config, fieldCategories, fieldsByCategory } = fixtures;

  Object.entries(fieldsByCategory).forEach(([field, category]) => {
    assert.equal(
      getFieldCategory({
        defaultAction: config.defaultAction,
        field,
        fieldCategories,
      }),
      category,
      `should match expected category ${category} for field ${field}`
    );
  });
});

test('getFieldsByCategory', ({ fixtures }) => {
  const { config, fieldCategories, fieldsByCategory } = fixtures;
  const fieldNames = Object.keys(fieldsByCategory);

  assert.deepEqual(
    getFieldsByCategory({ config, fieldNames }),
    fieldsByCategory,
    'should match expected fields by category'
  );
});

test('syncFields', ({ fixtures }) => {
  const { rootJson, childJson, fieldsByCategory, syncedFields } = fixtures;

  assert.deepEqual(
    syncFields({ fromJson: rootJson, toJson: childJson, fieldsByCategory }),
    syncedFields,
    'should sync fields based on field category'
  );
});

test('syncFiles', ({ fixtures }) => {
  const { rootJson, childJson, config, syncedFields } = fixtures;

  const result = syncFiles({
    childJson,
    config,
    rootJson,
  });

  const expected = { ...childJson, ...syncedFields, scripts: syncedFields.scripts.sort() };

  assert.deepEqual(result, expected, 'should match expected json');
});

test.run();
