// @flow

import browserPolyfill from 'webextension-polyfill';

import type {
  BodyguardDbType,
  BrowserRuntimeType,
  BrowserSidebarActionType,
  BrowserStorageType,
  BrowserTabsType,
  BrowserTabType,
  BrowserType,
  HandleInternalMsgInterface,
  InternalMsgType,
  ObjectOfStrings,
  ObjectOfStuff,
  ObjectType,
} from '../libdefs';

const browser: BrowserType = browserPolyfill;

export const translate = (msg: string): string => browser.i18n.getMessage(msg);

export const errorHandler = () => {
  if (browser.runtime.lastError) {
    console.error(`Error: ${browser.runtime.lastError}`);
  } else {
    console.info('Item created successfully');
  }
};

export const stripUrl = (url: string): string => url.split('?')[0];

export const handleInternalMsg: HandleInternalMsgInterface = ({ type, message } = {}, el) => {
  if (type === 'DEBUG' && el)
    el.textContent = el.textContent += '\r\n\r\n' + message.join('\r\n↑↓\r\n');
};

//////////////////// BROWSER /////////////////////
export const getSidebarAction = (): BrowserSidebarActionType => browser.sidebarAction;
export const getRuntime = (): BrowserRuntimeType => browser.runtime;
export const getOnBeforeRequest = (): Function => browser.webRequest.onBeforeRequest;

// @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// TODO: prefer this for sending console logs https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#connection-based_messaging
export const sendInternalMsg = ({ type = 'DEBUG', message }: InternalMsgType): void =>
  browser.runtime.sendMessage({ type, message });

export const getOnMessage = (): Function => browser.runtime.onMessage;

// @see https://github.com/mdn/webextensions-examples/blob/master/history-deleter/history.js
export const getBrowserTabs = async (): Promise<BrowserTabType[]> =>
  browser.tabs.query({ active: true, currentWindow: true });

export const getBrowserWindow = async (): Promise<BrowserTabType> =>
  browser.windows.getCurrent({ populate: true });

export const getBrowserStorage = (): BrowserStorageType => browser.storage;
export const getBrowserLocalStorage = (): BodyguardDbType => getBrowserStorage().local.get();
export const setBrowserLocalStorage = (data: BodyguardDbType): void => {
  getBrowserStorage().local.set(data);
};
