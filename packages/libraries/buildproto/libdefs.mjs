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

export type acceptableNodEnvs = 'development' | 'production';

export type PkgJsonType = {
  config: {
    PATH_DIST: string,
    PATH_SRC: string,
    NODE_ENV: acceptableNodEnvs
  },
  main: string, // path to index.js|index.cjs,
  module: string, // path to index.mjs
  name: string,
  type: string,
  version: string,
  dependencies: { [string]: string },
  devDependencies: { [string]: string },
  ...
};
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

export type WebpackConfigType = WebpackOptions;

export type NodeprotoPackType = {
  builtinModules: string[],
  CLIENT_PORT?: number,
  ifDev?: boolean,
  ifProd?: boolean,
  pathDist: string,
  pathSrc: string,
  pkgJson: PkgJsonType,
  writeToDisk?: boolean,
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

export type BaseWebpackType = {
  configFile?: boolean | string,
  context?: string,
  copyOptions?: ObjectType,
  entry: Entry,
  entryPush?: string[],
  entryUnshift?: string[],
  NODE_ENV?: acceptableNodEnvs,
  cache?: boolean | ObjectType,
  processEnv?: ObjectType,

  experiments?: ObjectType,
  htmlOptions?: ObjectType,
  infrastructureLogging?: WebpackInfrastructureLoggingType,
  mode?: acceptableNodEnvs | 'none',
  module?: ModuleOptions,
  optimization?: OptimizationOptions,

  outputDir?: string,

  publicPath?: string,
  stats?: StatsOptions,
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
