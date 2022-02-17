// @flow


import type { ObjectOfStrings, ObjectType, PkgJsonType, SupportedNodeEnvsType } from './external';

import type { NodeprotoPackOptionsType } from './buildproto';


export type EsbuildPluginOptions = ObjectType;

export type EsbuildConfigType = {
  assetNames?: string,
  bundle?: boolean,
  define?: ObjectType,
  entryNames?: string | string[],
  entryPoints?: string[],
  external?: string[],
  format?: string,
  manifestFilename?: string,
  metafile?: boolean,
  minify?: boolean,
  outdir?: string,
  outExtension?: ObjectType,
  platform?: string,
  plugins?: ObjectType[],
  preserveSymlinks?: boolean,
  replaceEntryVars?: ObjectOfStrings,
  resolveExtensions?: string[],
  sourcemap?: boolean,
  target?: string[],
  watch?: ObjectType | boolean,
  write?: boolean,
  ...
}

export type BaseEsbuildType =  EsbuildConfigType & {
  ...NodeprotoPackOptionsType,
  entry: string | string[],
  ...
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

export type EsbuildCbOpts = {
  filter: RegExp,
  namespace?: string,
};

// @see https://esbuild.github.io/plugins/#on-resolve-arguments
export type EsbuildResolveKind = 'entry-point'
  | 'import-statement'
  | 'require-call'
  | 'dynamic-import'
  | 'require-resolve'
  | 'import-rule'
  | 'url-token';

// @see https://esbuild.github.io/plugins/#on-resolve-results
export type EsbuildOnResolveCbArgsType = {
  path: string, // unresolved path from source code
  importer: string, // module that is importing the path, use resolveDir instead
  namespace: string, // namespace of module containing the import
  resolveDir: string, // like importer, + supports virtual-modules (namespaces)
  kind: EsbuildResolveKind, // how the path was imported
  pluginData: mixed, // passed from the previous plugin
}

// @see https://esbuild.github.io/plugins/#on-resolve-results
 export type EsbuildOnResolveResultType = {
  errors?: EsbuildMessage[];
  external?: boolean;
  namespace?: string;
  path?: string;
  pluginData?: any;
  pluginName?: string;
  sideEffects?: boolean;
  suffix?: string;
  warnings?: EsbuildMessage[];
  watchDirs?: string[];
  watchFiles?: string[];
}

export interface EsbuildMessage {
  text: string;
  location: EsbuildLocation | null;
  detail: any; // The original error from a JavaScript plugin, if applicable
}

export interface EsbuildLocation {
  file: string;
  namespace: string;
  line: number; // 1-based
  column: number; // 0-based, in bytes
  length: number; // in bytes
  lineText: string;
}
export interface EsbuildOnResolveInterface {
  (args: EsbuildOnResolveCbArgsType): Promise<EsbuildOnResolveResultType | void>;
}

export type EsbuildBuildObjectType = {
  initialOptions: EsbuildConfigType,
  onStart: (fn: Function) => void,
  onResolve: (opts: EsbuildCbOpts, fn: EsbuildOnResolveInterface) => Promise<EsbuildOnResolveResultType>,
  onEnd: (fn: Function) => void,
  resolve: (path: string, { resolveDir: string }) => Promise<string>,
}

export interface EsbuildSetupInterface {
  (build: EsbuildBuildObjectType): void
}
