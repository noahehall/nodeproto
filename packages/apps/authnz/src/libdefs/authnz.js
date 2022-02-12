// @flow

import type { Server, KoaApp } from './external';

export type ServerType = Promise<Server>;
export type AppType = Promise<KoaApp>;
