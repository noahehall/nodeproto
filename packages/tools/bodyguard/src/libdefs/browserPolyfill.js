// @flow
// type annotations for the apis we are using

import type { ObjectOfStrings, ObjectType } from '@nodeproto/configproto/src/libdefs';

export type ObjectOfStuff = {
  [key: string]: string | Function | Object,
  ...
};

export type BrowserI18nType = {
  ...ObjectOfStuff,
  getMessage: (msg: string) => string,
};

export type BrowserRuntimeType = {
  ...ObjectOfStuff,
  lastError: ?string,
  sendMessage: ({ type: string, message: string }) => void,
  onMessage: Function,
};

export type BrowserSidebarActionType = {
  ...ObjectOfStuff,
};

export type BrowserWebRequestType = {
  ...ObjectOfStuff,
  onBeforeRequest: Function,
};

export type BrowserWindowsType = {
  getCurrent: ({ populate: boolean }) => BrowserTabType,
};

export type BrowserStorageType = {
  ...ObjectOfStuff,
  local: {
    ...ObjectOfStuff,
    get: () => ObjectOfStuff,
    set: (data: ObjectType) => void,
  },
};

export type BrowserTabsType = {
  ...ObjectOfStuff,
  query: ({ active: boolean, currentWindow: boolean }) => BrowserTabType[],
};

export type BrowserTabType = {
  ...ObjectOfStuff,
};

export type BrowserType = {
  ...ObjectOfStuff,
  i18n: BrowserI18nType,
  runtime: BrowserRuntimeType,
  sidebarAction: BrowserSidebarActionType,
  webRequest: BrowserWebRequestType,
  windows: BrowserWindowsType,
  storage: BrowserStorageType,
  tabs: BrowserTabsType,
};
