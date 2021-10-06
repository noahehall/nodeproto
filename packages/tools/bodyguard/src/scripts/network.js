'use strict';

let myWindowId;

const stripUrl = url => url.split('?')[0]

const cache = {};
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

const transformUrl = (url, find, replace) => (
  url.includes(find)
  && url.replace(find, replace)
);

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function debugUrl(requestDetails) {
  const { matching, find, replace } = Object.values(cache)[0];

  if (!requestDetails.url.includes(matching)) return void 0;

  console.info("bodyguard match: " + requestDetails.url);
  const newUrl = transformUrl(requestDetails.url, find, replace)
  if (newUrl) console.info('bodyguard replaced: ' + newUrl)
}

// // @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function guardUrl(requestDetails) {
  const { matching, find, replace } = Object.values(cache)[0];

  if (!requestDetails.url.includes(matching)) return void 0;

  const redirectUrl = transformUrl(requestDetails.url, find, replace);

  console.info('\n\n redirectUrl', redirectUrl)
  return redirectUrl && Promise.resolve({ redirectUrl });
}

const syncBodyguards = () => {
  browser.webRequest.onBeforeRequest.removeListener(debugUrl);
  browser.webRequest.onBeforeRequest.removeListener(guardUrl);

  Object.entries(cache).forEach(([tabUrl, bodyguardRules]) => {
    if (!bodyguardRules) return void(
      guards.clear(),
      debug.clear(),
      console.info('all guards inactive')
    );

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

const retrieveBodyguardRules = () => {
  return browser.tabs.query({ windowId: myWindowId, active: true })
    // get tab url
    .then(tabs => stripUrl(tabs[0].url))
    // get data from storage
    .then(url => browser.storage.local.get().then(data => {

      cache[url] = data[url]
    }));
}
browser.windows.getCurrent({ populate: true }).then(windowInfo => {
  myWindowId = windowInfo.id;

  retrieveBodyguardRules()
    .then(() => syncBodyguards())
});
