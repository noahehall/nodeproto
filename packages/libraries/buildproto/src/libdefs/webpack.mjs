// @flow

// @see flow-typed/npm/webpack_v5.x.x.js
import type {
  Entry,
  ModuleOptions,
  ObjectType,
  OptimizationOptions,
  StatsOptions,
  WebpackCompiler,
  WebpackOptions,
  WebpackPluginFunction,
  WebpackPluginInstance,
} from './external';


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
  cache?: boolean | ObjectType,
  configFile?: boolean | string,
  context?: string,
  copyOptions?: ObjectType,
  entry: Entry,
  entryPush?: Entry[],
  entryUnshift?: Entry[],
  NODE_ENV?: SupportedNodeEnvsType,
  pluginsPush?: WebpackPluginType[],
  pluginsUnshift?: WebpackPluginType[],
  processEnv?: ObjectType,

  // experiments?: ObjectType,
  // infrastructureLogging?: WebpackInfrastructureLoggingType,
  // mode?: SupportedNodeEnvsType | 'none',
  // module?: ModuleOptions,
  // optimization?: OptimizationOptions,
  // outputDir?: string,
  // publicPath?: string,
  // stats?: StatsOptions,
  // stringReplaceLoader?: ObjectType,
  ...
}

export type ReactDevType = BaseWebpackType & {
  htmlOptions?: ObjectType,
  ...
};
