#!/usr/bin/env node --experimental-loader="./node_modules/@nodeproto/configproto/src/node/loaders/flow.mjs" --experimental-specifier-resolution=node

console.info('\nrunning jsync\n');

import("../src/index.mjs");  
