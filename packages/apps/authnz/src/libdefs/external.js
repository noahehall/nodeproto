// @flow

import typeof Application from 'koa';
import type { Options as KoaBodyParserOptions } from 'koa-bodyparser';

export type * from '@nodeproto/configproto/src/libdefs';
export type * from '@nodeproto/envproto/src/libdefs';
export type * from 'https';
export type * from 'http'; // eslint-disable-line node/no-deprecated-api
export type * from 'koa';

export type KoaBodyParserOptionsType = KoaBodyParserOptionsType;

export type KoaApp = Application;
