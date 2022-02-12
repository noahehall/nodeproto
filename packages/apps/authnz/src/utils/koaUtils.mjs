// @flow

import type {
  Context,
  ObjectOfStrings,
  ObjectType,
  Request,
  Response,
} from '../libdefs';

export const ctxGet = (t: string, r: Request | Response): mixed => r.get(t);

export const resGet = (c: Context, t: string): mixed => ctxGet(t, c.response);

export const reqGet = (c: Context, t: string): mixed => ctxGet(t, c.request);

export const getEnv = (
  t: string,
  d: string|void = process.env[`npm_package_config_${t}`],
  e: {[x: string]: string | void } = process.env
): mixed =>
  t in e ? e[t] : d;

export const isFaviconRequest = (p: string): boolean => p === '/favicon.ico';
