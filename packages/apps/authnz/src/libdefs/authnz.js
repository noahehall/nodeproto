// @flow

import type {
  Context,
  IncomingMessage,
  KoaApp,
  ObjectType,
  Server,
  ServerResponse,
} from './external';

export type KoaAppType = {
  ...KoaApp,
  callback: () => (IncomingMessage, ServerResponse) => void,
  Context: Context,
  use: (MiddlewareAllTypes | MiddlewareAllTypes[]) => KoaAppType,
  then: ((KoaAppType) => AppType) => AppType,
  ...
};

export type ServerType = Promise<Server>;
export type AppType = Promise<KoaAppType>;

export type NextType = () => Promise<void>;

export type MiddlewareType = (config?: ObjectType, KoaAppType) => Promise<
  (Context, NextType) => Promise<void>>;

export type MiddlewareConfigKoaAppType = (config?: ObjectType, KoaAppType) => Promise<mixed>

export type MiddlewareContextNextType = (Context, NextType) => Promise<void>

export type MiddlewareAllTypes = MiddlewareType & MiddlewareConfigKoaAppType & MiddlewareContextNextType;

export type MiddlewareComposeType = () => Promise<MiddlewareAllTypes[]>;
