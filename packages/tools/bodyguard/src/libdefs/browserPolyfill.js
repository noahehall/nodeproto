// @flow
// type annotations for the apis we are using

import type { ObjectOfStrings, ObjectType } from '@nodeproto/configproto/src/libdefs';

import type { BodyguardCacheType } from './bodyguard';

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
  sendMessage: ({ type: string, message: string & string[] }) => void,
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
    get: (() => BodyguardCacheType) & ((thing: string) => string | ObjectType),
    set: (data: ObjectType) => void,
    ...
  },
  onChanged: {
    hasListener: (listener: Function) => boolean,
    addListener: (listener: Function) => void,
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
  menus: {
    create: ({ id: string, title: string, contexts: string[] }, errorHandler: Function) => void,
  },
};