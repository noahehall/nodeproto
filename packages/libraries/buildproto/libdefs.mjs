// @flow

export type * from '@nodeproto/configproto/libdefs';
export type * from 'esbuild';
export type * from 'webpack';
export type * from 'koa';

import type { Middleware } from 'koa';

import type { ObjectType, StringContainerType } from '@nodeproto/configproto/libdefs';

// @see flow-typed/npm/webpack_v5.x.x.js
import type {
  ArrayOfStringOrStringArrayValues,
  Entry,
  ModuleOptions,
  OptimizationOptions,
  OutputOptions,
  StatsOptions,
  WebpackCompiler,
  WebpackOptions,
  WebpackPluginFunction,
  WebpackPluginInstance,
} from 'webpack';

export type PkgJsonType = ObjectType;
export type WebpackPluginType = WebpackPluginInstance | WebpackPluginFunction;

// @see copypasta from flow-typed/npm/webpack_v5.x.x.js
export type WebpackInfrastructureLoggingType = {
  level?: 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose',
  debug?:
    | string
    | RegExp
    | ((string) => boolean)
    | Array<string | RegExp | ((string) => boolean)>,
};

export type WebpackConfigType = WebpackOptions & {
  configFile?: boolean | string,
  context?: string,
  entry?: Entry,
  experiments?: ObjectType,
  extensions?: string[],
  htmlOptions?: ObjectType,
  infrastructureLogging?: WebpackInfrastructureLoggingType,
  mainFields?: ArrayOfStringOrStringArrayValues,
  mode?: string,
  module?: ModuleOptions,
  optimization?: OptimizationOptions,
  output?: OutputOptions,
  outputDir?: string,
  plugins?: WebpackPluginType[],
  publicPath?: string,
  stats?: StatsOptions,
  ...
}

export type NodeprotoPackType = {
  APP_NAME: string,
  CLIENT_PORT?: number,
  pathDist: string,
  pathSrc: string,
  pkgJson: PkgJsonType,
  writeToDisk: boolean,
  builtinModules: string[],
  ifDev?: boolean,
  ifProd?: boolean,
};

export type NodeprotoWebpackServerType = {
  app: any,
  compiler: WebpackCompiler,
  config: { host?: string, port?: number, signal?: AbortSignal, ... },
  controller: AbortController,
  httpTerminator: ObjectType,
  server: any,
  ...
}

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

export type WebpackSetupType = WebpackConfigType & {
  entryPush?: string[],
  entryUnshift?: string[],
  IS_DEV?: boolean,
  IS_PROD?: boolean,
  NODE_ENV?: string,
  pack?: NodeprotoPackType,
  PATH_DIST?: string,
  PATH_SRC?: string,
  pathDist?: string,
  pathSrc?: string,
  pkgJsonPath?: string,
  copyOptions?: EsbuildPluginOptions,
  processEnv?: ObjectType,
  basePlugins?: WebpackPluginType[],
  stringReplaceLoader?: ObjectType,
  ...
}

export type EsbuildConfigType = {
  assetNames: string,
  bundle: boolean,
  define: ObjectType,
  define: ObjectType[],
  entryNames: string | string[],
  entryPoints: string[],
  external: string[],
  metafile: boolean,
  minify: boolean,
  outdir: string,
  outExtension: ObjectType,
  platform: string,
  plugins: ObjectType[],
  preserveSymlinks: boolean,
  resolveExtensions: string[],
  sourcemap: boolean,
  target: string[],
  watch: ObjectType | boolean,
  write: boolean,
  ...
}

export type EsbuildSetupType = EsbuildConfigType & {
  entry: string,
  pkgJson: PkgJsonType,
}

export type EsbuildResultsType = {
  errors?: string[],
  warnings?: string[],
  metafile: ObjectType,
  ...
}
