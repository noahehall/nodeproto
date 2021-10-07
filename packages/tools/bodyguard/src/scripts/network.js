'use strict';

let myWindowId;

const stripUrl = url => url.split('?')[0]

const cache = { global: {}};
const guards = new Set();
const debug = new Set();
// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
// this should come from bodyguardRules
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

// TODO: should either replace| substitute
const transformUrl = (url, find, replace) => (
  url.includes(find)
  && url.replace(find, replace)
);

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function debugUrl(requestDetails) {
  const { matching, find, replace } = cache.global;

  if (!requestDetails.url.includes(matching)) return void 0;


  // push these logs into the sidebar.form.elements.code#debug element
  console.info("bodyguard match: " + requestDetails.url);
  const newUrl = transformUrl(requestDetails.url, find, replace)
  if (newUrl) console.info('bodyguard replaced: ' + newUrl)
}

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function guardUrl(requestDetails) {
  const { matching, find, replace } = Object.values(cache)[0];

  if (!requestDetails.url.includes(matching)) return void 0;

  const redirectUrl = transformUrl(requestDetails.url, find, replace);

  return redirectUrl && Promise.resolve({ redirectUrl });
}

const syncBodyguards = () => {
  browser.webRequest.onBeforeRequest.removeListener(debugUrl);
  browser.webRequest.onBeforeRequest.removeListener(guardUrl);

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
    }
    else if (guards.has(bodyguardRules.matching)) guards.delete(bodyguardRules.matching);

    // sync guards on debug
    if (bodyguardRules.debug) {
      if (!debug.has(bodyguardRules.find)) debug.add(bodyguardRules.find);
    }
    else if (debug.has(bodyguardRules.find)) debug.delete(bodyguardRules.find);
  });

  if (debug.size) browser.webRequest.onBeforeRequest.addListener(
    debugUrl, { urls: ["<all_urls>"] }
  );

  if (guards.size) {
    let urls = [];
    guards.forEach(url => url && urls.push(url + '*'));

    browser.webRequest.onBeforeRequest.addListener(
      guardUrl,
      { urls }, // types: redirectTypes  < use to be in object
      ["blocking"]
    );
  }
}

const retrieveActiveTab = () => browser
  .tabs.query({ windowId: myWindowId, active: true })
  .then(tabs => stripUrl(tabs[0].url))

const retrieveBodyguardRules = () => browser
  .storage.local.get().then(bodyguardRules => {
    const [ url, data ] = Object.entries(bodyguardRules)[0];

    cache[url] = data[url];

    return cache;
  });
browser.windows.getCurrent({ populate: true }).then(windowInfo => {
  myWindowId = windowInfo.id;

  retrieveBodyguardRules()
    .then(() => syncBodyguards())
});

const bodyguardShiftManager = diff => {
  // TODO: enable per activeTab url bodyguard rules (url === activate tab)
  // const [ url, { newValue: data } ] = Object.entries(diff)[0];
  cache.global = diff.global.newValue;
  syncBodyguards();
};

if (!browser.storage.onChanged.hasListener(bodyguardShiftManager))
  browser.storage.onChanged.addListener(bodyguardShiftManager);
