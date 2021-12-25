#!/usr/bin/env node --experimental-specifier-resolution=node --experimental-loader=\"./node_modules/@nodeproto/configproto/src/node/loaders/flow.mjs\"

console.info("\nrunning jsync\n");
import("../src/index.mjs");
