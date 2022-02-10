// @flow

import type { PkgJsonType } from './external';

export type NodeprotoPackType = {
  builtinModules: string[],
  ifDev?: boolean,
  ifProd?: boolean,
  pathDist: string,
  pathSrc: string,
  pkgJson: PkgJsonType,
  writeToDisk?: boolean,
};
