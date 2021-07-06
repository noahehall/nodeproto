'use strict';

var pattern = "https://about.pinterest.com/";

// @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function logURL(requestDetails) {
  if (!requestDetails.url.startsWith(pattern)) return void 0;

  console.log("@nodeproto/bodyguard: " + requestDetails.url);
}

// @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest#additional_objects
function redirect(requestDetails) {

  return Promise.resolve({
    redirectUrl: "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif"
  });
}

// @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType
const redirectTypes = [
  'image',
  // imageset
  // script
  // stylesheet
  // xmlhttprequest
  // sub_frame
  // speculative
  // websocket

]

browser.webRequest.onBeforeRequest.addListener(
  redirect,
  {
    urls:[pattern + '*'],
    types: redirectTypes
  },
  ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {
    urls: ["<all_urls>"]
  }
);
