// @flow

// @see flow-typed/npm/webpack_v5.x.x.js
import type {
  Entry,
  Externals,
  ModuleOptions,
  ObjectType,
  OptimizationOptions,
  StatsOptions,
  SupportedNodeEnvsType,
  WebpackCompiler,
  WebpackOptions,
  WebpackPluginFunction,
  WebpackPluginInstance,
} from './external';

import type { NodeprotoPackOptionsType } from './buildproto';

export type WebpackPluginType = WebpackPluginInstance | WebpackPluginFunction;
export type WebpackConfigType = WebpackOptions;


// @see copypasta from flow-typed/npm/webpack_v5.x.x.js
export type WebpackInfrastructureLoggingType = {
  level?: 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose',
  debug?:
    | string
    | RegExp
    | ((string) => boolean)
    | Array<string | RegExp | ((string) => boolean)>,
};

export type NodeprotoWebpackServerType = {
  app: any,
  compiler: WebpackCompiler,
  cidr: { host?: string, port?: number, signal?: AbortSignal, ... },
  controller: AbortController,
  httpTerminator: ObjectType,
  server: any,
  ...
}

export type BaseWebpackType = {
  ...NodeprotoPackOptionsType,
  cache?: boolean | ObjectType,
  configFile?: boolean | string,
  context?: string,
  copyOptions?: ObjectType,
  entry: Entry,
  entryPush?: Entry[],
  entryUnshift?: Entry[],
  externals?: Externals, // function | Array<ExternalItem>
  infrastructureLogging?: WebpackInfrastructureLoggingType,
  mode?: SupportedNodeEnvsType | 'none',
  pluginsPush?: WebpackPluginType[],
  pluginsUnshift?: WebpackPluginType[],
  processEnv?: ObjectType,
  stats?: StatsOptions,
  target?: string,
  writeToDisk?: boolean,

  // experiments?: ObjectType,
  // module?: ModuleOptions,
  // optimization?: OptimizationOptions,
  // outputDir?: string,
  // publicPath?: string,
  // stringReplaceLoader?: ObjectType,
  ...
}

export type HtmlOptionsType = {
  filename?: string,
  template?: string,
  inject?: boolean,
  chunks?: string[],
  ...
}

export type WebpackHtmlOptionsType = HtmlOptionsType | HtmlOptionsType[];

export type ReactDevType = BaseWebpackType & {
  htmlOptions?: WebpackHtmlOptionsType,
  ...
};
