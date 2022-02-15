// @flow
// type annotations for the apis we are using

import type { ObjectOfStrings, ObjectType } from '@nodeproto/configproto/src/libdefs';

export type ObjectOfStuff = {
  [key: string]: string | Function | Object,
  ...
};

export type BrowserI18nType = {
  getMessage: (msg: string) => string,
  ...
};

export type BrowserRuntimeType = {
  lastError: ?string,
  sendMessage: ({ type: string, message: string }) => void,
  onMessage: Function,
  openOptionsPage: Function,
  ...
};

export type BrowserSidebarActionType = {
  toggle: Function,
  ...
};

export type BrowserWebRequestType = {
  onBeforeRequest: Function,
  ...
};

export type BrowserWindowsType = {
  getCurrent: ({ populate: boolean }) => BrowserTabType,
  ...
};

export type BrowserStorageType = {
  local: {
    get: () => ObjectOfStuff,
    set: (data: ObjectType) => void,
    ...
  },
  ...
};

export type BrowserTabsType = {
  [x: string]: BrowserTabType,
  query: ({ active: boolean, currentWindow: boolean }) => BrowserTabType[],
  ...
};

export type BrowserTabType = {
  url: string,
  id: string,
  ...
};

export type BrowserType = {
  i18n: BrowserI18nType,
  runtime: BrowserRuntimeType,
  sidebarAction: BrowserSidebarActionType,
  storage: BrowserStorageType,
  tabs: BrowserTabsType,
  webRequest: BrowserWebRequestType,
  windows: BrowserWindowsType,
  ...
};
