'use strict';

// TODO: remove this file after finalizing ./index.mjs
const pkgJson = require('./package.json');
const util = require('util');

// FYI: exports not part of npm_package vars
// console.log('\n\n process.env', Object.keys(process.env)
//   .filter(key => key.startsWith('npm_')).sort()
// );
throw new Error(`Please require/import a defined path: ${util.inspect(
  Object.keys(pkgJson.exports).slice(1),
  false,
  3,
  true
)}`);
