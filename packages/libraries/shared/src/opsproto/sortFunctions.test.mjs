/* eslint-disable sort-keys */

import * as t from '@nodeproto/testproto/t';

import {
  isObject,
  isValue,
  sortArraysAndObjects,
  sortObject,
  sortSimpleThenComplexDataTypes,
} from '@nodeproto/shared';

const test = t.suite('@nodeproto/shared: sortFunctions.mjs');

const { assert } = t;

test('isObject', () => {
  assert.isFalse(isObject(''));
  assert.isFalse(isObject(0));
  assert.isFalse(isObject(false));
  assert.isFalse(isObject(null));
  assert.isFalse(isObject(true));
  assert.isFalse(isObject(undefined));
  assert.isTrue(isObject([]));
  assert.isTrue(isObject({}));
  assert.isTrue(isObject(new Map()));
  assert.isTrue(isObject(new Set()));
});

test('isValue', () => {
  assert.isTrue(isValue(''));
  assert.isTrue(isValue(0));
  assert.isTrue(isValue(false));
  assert.isTrue(isValue(null));
  assert.isTrue(isValue(true));
  assert.isTrue(isValue(undefined));
  assert.isFalse(isValue([]));
  assert.isFalse(isValue({}));
  assert.isFalse(isValue(new Map()));
  assert.isFalse(isValue(new Set()));
});

test('sortSimpleThenComplexDataTypes', () => {
  const sorted = Object.entries({
    d: {},
    a: 1,
    c: [],
    b: 'string',
  }).sort(sortSimpleThenComplexDataTypes);

  assert.deepEqual(sorted, [
    ['a', 1],
    ['b', 'string'],
    ['c', []],
    ['d', {}],
  ]);
});

test('sortArraysAndObjects', () => {
  const sortedArray = sortArraysAndObjects(undefined, [4, 3, 2, 1]);
  assert.deepEqual(sortedArray, [1, 2, 3, 4]);

  const sortedObject = sortArraysAndObjects(undefined, { 4: 4, 3: 3, 2: 2, 1: 1 });
  assert.deepEqual(sortedObject, { 1: 1, 2: 2, 3: 3, 4: 4 });
});
test.run();
