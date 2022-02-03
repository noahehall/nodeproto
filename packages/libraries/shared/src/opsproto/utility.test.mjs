import * as t from '@nodeproto/testproto/t';

import { isObject, isString, isValue } from '@nodeproto/shared';

const test = t.suite('@nodeproto/shared: utility.mjs');

const { assert } = t;

test('isString', () => {
  assert.isTrue(isString('foo'));
  assert.isFalse(isString(1));
  assert.isFalse(isString(true));
  assert.isFalse(isString(null));
  assert.isFalse(isString(undefined));
  assert.isFalse(isString(new Map()));
  assert.isFalse(isString(new Set()));
  assert.isFalse(isString(new Date()));
  assert.isFalse(isString(new RegExp()));
  assert.isFalse(isString(Symbol('foo')));
  assert.isFalse(isString(() => {}));
});

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

test.run();
