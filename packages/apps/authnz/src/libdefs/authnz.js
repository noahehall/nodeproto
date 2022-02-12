// @flow

import type { KoaApp, Server } from './external';

export type ServerType = Promise<Server>;
export type AppType = Promise<KoaApp>;
