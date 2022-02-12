// @flow

import type { ObjectOfStrings, ObjectType, PkgJsonType } from './external';

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

export type EsbuildPluginOptions = ObjectType;

export type EsbuildConfigType = {
  assetNames?: string,
  bundle?: boolean,
  define?: ObjectType,
  define?: ObjectType[],
  entryNames?: string | string[],
  entryPoints?: string[],
  external?: string[],
  metafile?: boolean,
  minify?: boolean,
  outdir?: string,
  outExtension?: ObjectType,
  platform?: string,
  plugins?: ObjectType[],
  preserveSymlinks?: boolean,
  resolveExtensions?: string[],
  sourcemap?: boolean,
  target?: string[],
  watch?: ObjectType | boolean,
  write?: boolean,
  ...
}

export type EsbuildSetupType = EsbuildConfigType & {
  entry: string,
  pkgJson: PkgJsonType,
}

export type EsbuildResultsType = {
  errors?: string[],
  warnings?: string[],
  metafile: {
    outputs: ObjectOfStrings,
    ...
  },
  ...
}

export type PopCopyOptionsType = {
  endingWith: RegExp,
  indir: string,
  outdir: string,
  recurse: boolean,
};
