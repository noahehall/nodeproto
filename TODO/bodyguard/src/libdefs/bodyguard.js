// @flow

import type { ObjectType } from './external';

export type InternalMsgType = {
  type?: string,
  message: string[],
};

export interface HandleInternalMsgInterface {
  (internalMsgs: InternalMsgType, el: HTMLElement): void;
}

// @ see sidebarAction/components/Form.mjs
export type BodyguardRulesType = {
  active?: boolean,
  debug?: boolean,
  find?: string,
  isglobal?: boolean,
  matching?: string,
  reject?: boolean,
  replace?: string,
  ...
};

export type BodyguardDbType = {
  global: BodyguardRulesType,
  ...
};
