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
