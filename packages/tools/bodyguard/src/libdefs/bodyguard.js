// @flow

import type { ObjectType } from './external';

export type InternalMsgType = {
  type?: string,
  message: string & string[],
};

export interface HandleInternalMsgInterface {
  (internalMsgs: InternalMsgType, el: HTMLElement): void;
}

export type BodyguardCacheType = {
  myWindowId: string,
  global: { [x: string]: mixed },
};
