// useful reference when creating new tests

import t from '#t';

const { assert } = t;

const test = t.suite('example test file');

// @TODO: add more examples, see t.msgs for everything we include by default
// @see https://www.chaijs.com/api/assert/#method_istrue
test('reference assertions', () => {
  assert(true === true);

  // put not infront of anything
  assert.isNotOk(0);

  // is
  assert.exists(true) // not null/undefined
  assert.isDefined(true) //not undefined
  assert.isOk('truthy test');
  assert.isTrue(true); // you get the idea, isPoop
  assert.isObject({});
  // assert.instanceOf(new assert, assert)
  assert.isEmpty([]);
  assert.isEmpty('');
  assert.isEmpty(new Map);
  assert.isEmpty({});


  // equality
  assert.equal('1', 1)
  assert.strictEqual(1, 1)
  assert.deepEqual({ tea: 'green' }, { tea: 'green' });

  // inspection
  assert.include([1,2,3], 2, 'array contains value');
  assert.include('foobar', 'foo', 'string contains substring');
  assert.include({ foo: 'bar', hello: 'universe' }, { foo: 'bar' }, 'object contains property')
  assert.deepInclude({foo: {a: 1}, bar: {b:1}}, {foo: {a: 1}}); // really useful

  assert.match('foobar', /^foo/, 'regexp matches');

  assert.lengthOf([1,2,3], 3, 'array has length of 3');
  assert.lengthOf('foobar', 6, 'string has length of 6');
  assert.lengthOf(new Set([1,2,3]), 3, 'set has size of 3');
  assert.lengthOf(new Map([['a',1],['b',2],['c',3]]), 3, 'map has size of 3');

  // includes keys
  assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'iDontExist', 'baz']);
  assert.hasAnyKeys({foo: 1, bar: 2, baz: 3}, {foo: 30, iDontExist: 99, baz: 1337});
  assert.hasAnyKeys(new Map([[{foo: 1}, 'bar'], ['key', 'value']]), [{foo: 1}, 'key']);
  assert.hasAnyKeys(new Set([{foo: 'bar'}, 'anotherKey']), [{foo: 'bar'}, 'anotherKey']);

  // only contains keys
  assert.hasAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'bar', 'baz']);

  // can contain more keys
  assert.containsAllKeys({foo: 1, bar: 2, baz: 3}, ['foo', 'baz']);

  // arrays
  assert.sameMembers([ 1, 2, 3 ], [ 2, 1, 3 ], 'same members');
  assert.includeMembers([ 1, 2, 3 ], [ 2, 1, 2 ], 'include members');

  // errors
  assert.throws(() => { throw new Error('thrown must have a msg')}, / have a msg/);
  assert.doesNotThrow(() => { throw new Error('poop') }, 'Any Error thrown must not have this message');

  // comparisons
  assert.operator(1, '<', 2, 'everything is ok');
});

test.run();
