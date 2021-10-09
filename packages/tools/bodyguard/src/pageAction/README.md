TODO: unused

however keeping the files (eeew I know) because eventually i'll get back to this

icon added to the browsers URL bar (to the far right of the URL, before you get to the browser (actions) extension icons)

Page actions are like browser actions, except that they are associated with particular web pages rather than with the browser as a whole

 If an action is only relevant on certain pages, then you should use a page action and display it only on relevant pages. If an action is relevant to all pages or to the browser itself, use a browser action.

While browser actions are displayed by default, page actions are hidden by default.

```js
  // add this back to manifest.json
  "page_action": {
    "default_icon": {
      "48": "icons/icons8-muscle-48.png"
    },
    "default_popup": "pageAction/pageAction.html",
    "default_title": "@nodeproto/bodyguard",
    "browser_style": true,
    "chrome_style": true,
    "show_matches": ["<all_urls>"]
  },
```
