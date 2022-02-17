// @flow

import type { Externals, PkgJsonType, SupportedNodeEnvsType } from './external';

import type { EsbuildBuildObjectType, EsbuildOnResolveCbArgsType, EsbuildOnResolveResultType } from './esbuild';

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

export type NodeprotoEsbuildServerType = {
  close: () => void,
  runApp: () => Promise<NodeprotoEsbuildServerInstanceType>,
}

export type NodeprotoEsbuildServerInstanceType = NodeprotoEsbuildServerType & {
  controller: AbortController,
  httpTerminator: { terminate: () => void, ... },
  server: NodeprotoEsbuildServerType,
}

export type NodeprotoEsbuildServerTrackerType = Map<string[], NodeprotoEsbuildServerInstanceType>;


// TODO
export type PopCopyFileToCopyType = {
  ms?: number,
  outPath: string,
  sourcePath: string,
};

export type PopCopyOptionsType = {
  cache?: Map<string, PopCopyFileToCopyType>,
  filter: RegExp,
  validImportKinds?: RegExp,
};
