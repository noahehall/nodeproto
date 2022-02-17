// @flow

import type {
  Context,
  KoaApp,
  ObjectOfFunctions,
  ObjectType,
} from './external';

import type {
  IncomingMessage as IncomingMessageS,
  ServerResponse as ServerResponseS,
  Server as ServerS,
} from 'https';

import type { IncomingMessage, Server, ServerResponse } from 'http';

export type KoaAppType = {
  ...KoaApp,
  callback: () => (IncomingMessage | IncomingMessageS, ServerResponse | ServerResponseS) => void,
  context: { ...Context, config: ObjectType },
  use: (MiddlewareType) => KoaAppType,
  then: ((KoaAppType) => AppType) => AppType,
  ...
};

export type ServerType = Promise<ServerS | Server>;
export type AppType = Promise<KoaAppType>;
export type NextType = () => Promise<void>;
export type MiddlewareFactoryType = (KoaAppType) => MiddlewareType;
export type MiddlewareType = (Context, NextType) => Promise<void> | void
export type MiddlewareComposeType = (MiddlewareType[]) => MiddlewareType;
export type RouterType = ObjectOfFunctions;
export type ControllerType = (RouterType, KoaAppType) => Promise<void>;


// only the ones with comments have been confirmed
// rather focus on the CI + virtualization stuff
// before I dive deep into this shiz
export type KoaHelmetType = {
  contentSecurityPolicy: MiddlewareFactoryType,
  crossOriginEmbedderPolicy: MiddlewareFactoryType,
  crossOriginOpenerPolicy: MiddlewareFactoryType,
  crossOriginResourcePolicy: MiddlewareFactoryType,
  dnsPrefetchControl: MiddlewareFactoryType,
  expectCt: MiddlewareFactoryType,
  frameguard: MiddlewareFactoryType,
  hidePoweredBy: MiddlewareFactoryType, // x-powered-by
  hsts: MiddlewareFactoryType,
  ieNoOpen: MiddlewareFactoryType,
  noSniff: MiddlewareFactoryType,
  originAgentCluster: MiddlewareFactoryType,
  permittedCrossDomainPolicies: MiddlewareFactoryType,
  referrerPolicy: MiddlewareFactoryType,
  xssFilter: MiddlewareFactoryType,
  ...
}
