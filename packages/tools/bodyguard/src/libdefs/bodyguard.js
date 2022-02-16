// @flow

import type { ObjectType } from './external';

export type InternalMsgType = {
  type?: string,
  message: string & string[],
};

export interface HandleInternalMsgInterface {
  (internalMsgs: InternalMsgType, el: HTMLElement): void;
}

// @ see sidebarAction/components/Form.mjs
export type BodyguardRulesType = {
  active?: boolean,
  debug?: boolean,
  find?: string,
  matching?: string,
  newValue?: ObjectType,
  reject?: boolean,
  replace?: string,
};

export type BodyguardCacheType = {
  myWindowId: string,
  global: BodyguardRulesType,
};
