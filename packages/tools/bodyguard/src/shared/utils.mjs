import browser from 'webextension-polyfill';

export const translate = msg => browser.i18n.getMessage(msg);

export const errorHandler = () => {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

export const stripUrl = url => url.split('?')[0]

export const handleInternalMsg = ({ type, message } = {}, el) => {
  if (type === 'DEBUG' && el)
    el.textContent = el.textContent += '\r\n\r\n' + message.join('\r\n↑↓\r\n')
}

//////////////////// BROWSER /////////////////////
export const getSidebarAction = () => browser.sidebarAction;
export const getRuntime = () => browser.runtime
export const getOnBeforeRequest = () => browser.webRequest.onBeforeRequest;

// @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
// TODO: prefer this for sending console logs https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts#connection-based_messaging
export const sendInternalMsg = ({ type = 'DEBUG', message }) => browser.runtime.sendMessage({ type, message });
export const getOnMessage = () => browser.runtime.onMessage

// @see https://github.com/mdn/webextensions-examples/blob/master/history-deleter/history.js
export const getBrowserTabs = () => browser.tabs.query({active: true, currentWindow: true});
export const getBrowserWindow = () => browser.windows.getCurrent({populate: true});

export const getBrowserStorage = () => browser.storage;
export const getBrowserLocalStorage = () => getBrowserStorage().local.get();
export const setBrowserLocalStorage = data => getBrowserStorage().local.set(data);
