// @flow

export type * from '@nodeproto/configproto/src/libdefs';

import { typeof wtf } from '@nodeproto/shared';

// TODO: check interface contract in test file and add additional annotations
export type DirsType = {
  ...wtf,
  inceptionStore: string,
  ...
}
