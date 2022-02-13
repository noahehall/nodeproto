// @flow

// @see https://koajs.com/#application
// @see https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options
// @see https://github.com/crypto-utils/keygrip/blob/master/index.js#L12
// @see https://www.openssl.org/docs/man1.1.1/man1/ciphers.html#examples

import Keygrip from 'keygrip';

import type { ObjectType } from './libdefs';

export const NODE_ENV: string = process.env.NODE_ENV || 'development';

export const KEY_ONE: string = process.env.KEY_ONE || '64bytes_long_string_1';
export const KEY_TWO: string = process.env.KEY_TWO || '64bytes_long_string_2';

export const KOA_CONFIG: ObjectType = {
  env: NODE_ENV,
  proxyIpHeader: 'X-Real-IP',
  keys: (new Keygrip([KEY_ONE, KEY_TWO], 'sha512', 'base64'): string[]),
  // proxy: false,
};

export const APP_CONFIG: ObjectType = {
  charset: 'UTF-8', // https://datatracker.ietf.org/doc/html/rfc3629
};
