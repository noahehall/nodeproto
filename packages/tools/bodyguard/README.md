@nodeproto/bodyguard - protect your network requests with @nodeproto/bodyguard browser extension

![@nodeproto/bodyguard redirecting images on about.pinterest.com](./src/images/about.pinterest.com.png)

# TLDR

- for consumers: manually load `@nodeproto/bodyguard` as a temporary extension into an existing firefox window
  - firefox
    - install via URL: `about:debugging#/runtime/this-firefox`
      - click `load temporary extension` & select `manifest.json`
      - debug via URL: `about:devtools-toolbox?id=noahedwardhall%40gmail.com&type=extension`
  - chromium (edge, opera, chrome)
    - TODO

- for developers: automatically inject `@nodeproto/bodyguard` as a temporary extension into a new firefox window with hot-reloading
  - `pnpm install`
  - `pnpm webext:run`
    - update `root/config.js` to target a browser other than firefox

# TODO

- [provide linkback for free icon](https://icons8.com/icon/7319/muscle)
- [review how they set this up](https://github.com/ritwickdey/live-server-web-extension/blob/master/manifest.json)

# special thanks to

- [webextensions-examples/menu-demo](https://github.com/mdn/webextensions-examples/tree/master/menu-demo)
- [webextensions-examples/annotate-page](https://github.com/mdn/webextensions-examples/tree/master/annotate-page)