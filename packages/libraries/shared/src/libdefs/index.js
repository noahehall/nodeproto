// @flow

import type { PkgJsonType } from '@nodeproto/configproto/src/libdefs';

export type * from '@nodeproto/configproto/src/libdefs';

export type PackageJsonMeta = {
  file?: PkgJsonType,
  path?: string,
}
