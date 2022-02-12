// @flow

import type { Externals, PkgJsonType, SupportedNodeEnvsType } from './external';

export type NodeprotoPackOptionsType = {
  context?: string,
  NODE_ENV?: SupportedNodeEnvsType,
  PATH_DIST?: string,
  PATH_SRC?: string,
  writeToDisk?: boolean,
};

export type NodeprotoPackType = {
  builtinModules: Externals,
  context: string,
  ifDev: boolean,
  ifProd: boolean,
  NODE_ENV: SupportedNodeEnvsType,
  pathDist: string,
  pathSrc: string,
  pkgJson: PkgJsonType,
  writeToDisk: boolean,
};
