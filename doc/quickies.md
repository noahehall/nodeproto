# notes for extension preview
```sh
  # gneral instructions
  # mac = option, linux/windows = alt
  # tab === acept
  # esc === reject and close suggestions
  # ctrl + enter # open all suggestions in side bar (very cool)
  # hover suggestion to see more
```

```js
  // generating code from function name
  // type a descriptive function name and after the open brace click alt + ]
  // you definitely need to cycle through to find the one you want

  descriptiveFunctionName(expectedParams1,x...) { # <-- alt+] cycles through suggestions
```
```js
  // generating code from comments above function
  // can be single line or jsdocs

  // find all images without alternate text
  // and give them a red border
  function process() {

  /**
   * find all images without alternate text
   * and give them a red border
   */
  function process() {

  // multiply two numbers
  function // <-- you should see suggestions without even providing a function name
  // <-- lol you dont even need to type function keyword ;) just the comment #superdope
```
