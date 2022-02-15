// @flow

export type InternalMsgType = {
  type: string,
  message: string | string[],
};

export interface HandleInternalMsgInterface {
  (internalMsgs: InternalMsgType, el: HTMLElement): void;
}
