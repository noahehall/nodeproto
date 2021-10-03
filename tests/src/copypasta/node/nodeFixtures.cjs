// @see https://github.com/nodejs/node/blob/df22736d80588e04550cbb65a421a74dae661676/test/common/fixtures.js

'use strict';

const path = require('path');
const fs = require('fs');

const fixturesDir = path.join(__dirname, '..', 'fixtures');

function fixturesPath(...args) {
  return path.join(fixturesDir, ...args);
}

function readFixtureSync(args, enc) {
  if (Array.isArray(args))
    return fs.readFileSync(fixturesPath(...args), enc);
  return fs.readFileSync(fixturesPath(args), enc);
}

function readFixtureKey(name, enc) {
  return fs.readFileSync(fixturesPath('keys', name), enc);
}

function readFixtureKeys(enc, ...names) {
  return names.map((name) => readFixtureKey(name, enc));
}

module.exports = {
  fixturesDir,
  path: fixturesPath,
  readSync: readFixtureSync,
  readKey: readFixtureKey,
  readKeys: readFixtureKeys,
};


if (typeof require !== 'undefined' && require.main === module) {
  console.info('\n\n haha im in cjs land');
}
