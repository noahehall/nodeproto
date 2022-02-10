// @flow

import type { PackageJsonMeta } from '@nodeproto/shared/src/libdefs';
import type { PkgJsonType } from '@nodeproto/configproto/src/libdefs';

export type * from '@nodeproto/configproto/src/libdefs';
export type * from '@nodeproto/shared/src/libdefs';


export type defaultActions = 'spreadRootValues' | 'forceRootValues' | 'ignoreRootValues';

export type JsyncConfigType = {
  root: boolean,
  maxLookups: number,
  defaultAction: defaultActions,
  ignoreRootValues: string[],
  forceRootValues: string[],
  spreadRootValues: string[],
}

export type JsyncMetaType = PackageJsonMeta |{
  ...PackageJsonMeta,
  file?: {
    ...PkgJsonType,
    jsync?: JsyncConfigType,
  },
}
