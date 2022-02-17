// @flow

// so this prototype was left in a state
// where the next step was to enable per tab bodyguard rules
// looks like I never finished implementig the logic before life happened

import {
  getBrowserLocalStorage,
  getBrowserStorage,
  getBrowserTabs,
  getBrowserWindow,
  getOnBeforeRequest,
  sendInternalMsg,
  stripUrl,
} from '../shared/utils';

import type { BodyguardRulesType, ObjectType } from '../libdefs';

let myWindowId: string = '';
let bodyguardRulesCache: BodyguardRulesType = {};

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
const transformUrl = (url: string, find?: string, replace?: string): string | boolean =>
  typeof find !== 'undefined' &&
  typeof replace !== 'undefined' &&
  url.includes(find) &&
  url.replace(find, replace);

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
export const debugUrl = (requestDetails: { url: string }): void => {
  const { matching, find, replace } = bodyguardRulesCache;

  if (!matching || !requestDetails.url.includes(matching)) return void 0;

  sendInternalMsg({
    type: 'poop',
    message: [
      `bodyguard match: ${requestDetails.url}`,
      `replaced: ${String(transformUrl(requestDetails.url, find, replace))}`,
    ],
  });
};

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function guardUrl(requestDetails) {
  const { matching, find, replace } = bodyguardRulesCache;

  if (!matching || !find || !replace || !requestDetails.url.includes(matching)) return void 0;

  const redirectUrl = transformUrl(requestDetails.url, find, replace);

  return redirectUrl && Promise.resolve({ redirectUrl });
}

const syncBodyguards = () => {
  console.info('\n\n syncing body guards');

  // remove previous listeners
  onBeforeRequest.removeListener(debugUrl);
  onBeforeRequest.removeListener(guardUrl);

  // sync guards on duty
  if (bodyguardRulesCache.active) {
    if (!guards.has(bodyguardRulesCache.matching)) guards.add(bodyguardRulesCache.matching);
  } else if (guards.has(bodyguardRulesCache.matching)) guards.delete(bodyguardRulesCache.matching);

  // sync guards on debug
  if (bodyguardRulesCache.debug) {
    if (!debug.has(bodyguardRulesCache.find)) debug.add(bodyguardRulesCache.find);
  } else if (debug.has(bodyguardRulesCache.find)) debug.delete(bodyguardRulesCache.find);

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

const retrieveBodyguardRules = async (): Promise<BodyguardRulesType | void> => {
  const bodyguardDb = await getBrowserLocalStorage();

  bodyguardRulesCache = bodyguardDb.global;

  return bodyguardRulesCache;
};

export const bodyguardShiftManager = (newBodyguardRules: BodyguardRulesType): void => {
  // TODO: enable per activeTab url bodyguard rules (url === activate tab)

  bodyguardRulesCache = newBodyguardRules;
  syncBodyguards();
};

(async () => {
  console.info('\n\n initializing @nodeproto/bodyguard');

  myWindowId = (await getBrowserWindow()).id;

  await retrieveBodyguardRules();
  syncBodyguards();
})();

// use storage.onChange vs browser.runtime as we want to persist this data anyway
if (!storage.onChanged.hasListener(bodyguardShiftManager))
  storage.onChanged.addListener(bodyguardShiftManager);
