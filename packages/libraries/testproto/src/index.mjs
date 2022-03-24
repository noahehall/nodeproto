// @flow

// @see https://github.com/lukeed/uvu/blob/master/docs/api.uvu.md
// use fully qualified name until https://github.com/nodejs/node/issues/41321
// note ./t fails, but ./t.mjs works
// /t works internall, it causes import * as t to fail in consumers
export * from '@nodeproto/testproto/t';  // eslint-disable-line
