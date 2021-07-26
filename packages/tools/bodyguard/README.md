![@nodeproto/bodyguard redirecting images on about.pinterest.com](./about.pinterest.com.png)


# TLDR

  - method A: manually load `@nodeproto/bodyguard` as a temporary extension into and existing firefox window
    - load the manifest.json here: `about:debugging#/runtime/this-firefox`
      - click `load temporary extension` & select `manifest.json`
      - click `inspect` to and view the dev console
        - or load `about:devtools-toolbox?id=noahedwardhall%40gmail.com&type=extension`

  - method B: automatically inject `@nodeproto/bodyguard` as a temporary extension into a new firefox window with hot-reloading
    - `pnpm install`
    - `pnpm start`

  - see `root/network.js` for network request mgmt
  - see `root/screen.js` for DOM mgmt

# TODO
  - [provide linkback for free icon](https://icons8.com/icon/7319/muscle)

# links
  - packages
    - [web-ext: manage firefox extensions](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)

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
