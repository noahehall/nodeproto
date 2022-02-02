# TLDR

- where the file?
- file locations and things

## important notes

- should be fully esm + cjs interopable with the following caveats
  - a fn will accept `import.meta.url` in esm, or `__filename` in cjs
    - or really any absolute path
  - a fn will accept `import.meta` in esm... or `__filename` in cjs
  - in both cases we will obsfucate the mechanics so that the logic works as expected in both environments

## import dependencies

- [readdir](https://github.com/folder/readdir)
- [jsonc](https://github.com/fabiospampinato/jsonc-simple-parser/blob/master/test/lib/index.js)
