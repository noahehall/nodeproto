
# TLDR
  - skipping hella shit as i need this for work tomorrow
  - [load the manifest.json here](about:debugging#/runtime/this-firefox)
    - click `load temporary extension` & select `manifest.json`
    - click `inspect`

# TODO
  - [provide linkback for free icon](https://icons8.com/icon/7319/muscle)

# links
  - packages
    - [web-ext firefox extension node mgmt package](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)

  - specs
    - [content scripts](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)
    - [match patterns in extension manifests](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns)
    - [filters to apply to webrequest events](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/RequestFilter)
    - [webrequest api](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest)
    - [onBeforeRequest contract](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest)
    - [resource types used to filter](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/ResourceType)

  - tutorials
    - [intercept http requests](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests)
    - [mozilla: your first extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension)
  -



# examples
  - manifest.json
    - loads js file with access to `window.document` on all matching matches
      ```json
        "content_scripts": [
          {
            "matches": ["*://*.mozilla.org/*"],
            "js": ["bodyguard.js"]
          }
        ],
      ```
    - give your extension an id
      ```json
        "browser_specific_settings": {
          "gecko": {
            "id": "noahedwardhall@gmail.com"
          }
        }
      ```
  - onBeforeRequest
    ```js
      browser.webRequest.onBeforeRequest.addListener(
        listener,             // function
        filter,               //  object
        extraInfoSpec         //  optional array of strings
      )
      browser.webRequest.onBeforeRequest.removeListener(listener)
      browser.webRequest.onBeforeRequest.hasListener(listener)

    ```
