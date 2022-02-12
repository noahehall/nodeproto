// @flow

import type { Externals, PkgJsonType } from './external';

export type NodeprotoPackType = {
  builtinModules: Externals,
  ifDev?: boolean,
  ifProd?: boolean,
  pathDist: string,
  pathSrc: string,
  pkgJson: PkgJsonType,
  writeToDisk?: boolean,
};
