// @flow

import {
  getBrowserLocalStorage,
  getBrowserStorage,
  getBrowserTabs,
  getBrowserWindow,
  getOnBeforeRequest,
  sendInternalMsg,
  stripUrl,
} from '../shared/utils';

import type { BodyguardCacheType, ObjectType } from '../libdefs';

const cache: BodyguardCacheType = { myWindowId: '', global: {} };

const debug = new Set();
const guards = new Set();
const onBeforeRequest = getOnBeforeRequest();
const storage = getBrowserStorage();

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
// TODO: this should come from bodyguardRules
// const redirectTypes = [
//   'image',
//   // imageset
//   // script
//   // stylesheet
//   // xmlhttprequest
//   // sub_frame
//   // speculative
//   // websocket
// ]

// TODO: should handle replace|substitute
const transformUrl = (url, find, replace) => url.includes(find) && url.replace(find, replace);

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function debugUrl(requestDetails) {
  const { matching, find, replace } = cache.global;

  if (!requestDetails.url.includes(matching)) return void 0;

  sendInternalMsg({
    message: [
      `bodyguard match: ${requestDetails.url}`,
      `replaced: ${transformUrl(requestDetails.url, find, replace)}`,
    ],
  });
}

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function guardUrl(requestDetails) {
  const { matching, find, replace } = Object.values(cache)[0];

  if (!requestDetails.url.includes(matching)) return void 0;

  const redirectUrl = transformUrl(requestDetails.url, find, replace);

  return redirectUrl && Promise.resolve({ redirectUrl });
}

const syncBodyguards = () => {
  console.info('\n\n syncing body guards');

  // remove previous listeners
  onBeforeRequest.removeListener(debugUrl);
  onBeforeRequest.removeListener(guardUrl);

  Object.entries(cache).forEach(([tabUrl, bodyguardRules = {}]) => {
    // TODO: enhancce with per-tab urls
    // if (!bodyguardRules) {
    // guards.clear();
    // debug.clear(),
    // console.info('all guards inactive'),
    // continue;
    // }

    // sync guards on duty
    if (bodyguardRules.active) {
      if (!guards.has(bodyguardRules.matching)) guards.add(bodyguardRules.matching);
    } else if (guards.has(bodyguardRules.matching)) guards.delete(bodyguardRules.matching);

    // sync guards on debug
    if (bodyguardRules.debug) {
      if (!debug.has(bodyguardRules.find)) debug.add(bodyguardRules.find);
    } else if (debug.has(bodyguardRules.find)) debug.delete(bodyguardRules.find);
  });

  console.info('\n\n new bodyguard state:', debug, guards);

  if (debug.size) onBeforeRequest.addListener(debugUrl, { urls: ['<all_urls>'] });

  if (guards.size) {
    let urls = [];
    guards.forEach((url) => url && urls.push(url + '*'));

    onBeforeRequest.addListener(
      guardUrl,
      { urls }, // types: redirectTypes  < use to be in object
      ['blocking']
    );
  }
};

// TODO: extract the updating of cache to a separate fn
const retrieveBodyguardRules = async (): Promise<BodyguardCacheType> => {
  const bodyguardRules = await getBrowserLocalStorage();

  const [url, data] = Object.entries(bodyguardRules)[0];

  // $FlowFixMe[incompatible-use] data typed as mixed
  cache[url] = data[url];

  return cache;
};

export const bodyguardShiftManager = ({ global }: { global: { newValue: Object } }): void => {
  // TODO: enable per activeTab url bodyguard rules (url === activate tab)
  // const [ url, { newValue: data } ] = Object.entries(diff)[0];

  cache.global = global.newValue;
  syncBodyguards();
};

(async () => {
  console.info('\n\n initializing @nodeproto/bodygaurd');

  const windowInfo = await getBrowserWindow();

  cache.myWindowId = windowInfo.id;

  // TODO: this fn updates the cache, but we need to extract this logic
  // ^ to a separate fn
  await retrieveBodyguardRules();
  syncBodyguards();
})();

// use storage.onChange vs browser.runtime as we want to persist this data anyway
if (!storage.onChanged.hasListener(bodyguardShiftManager))
  storage.onChanged.addListener(bodyguardShiftManager);
