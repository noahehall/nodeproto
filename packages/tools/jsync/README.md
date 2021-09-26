# @nodeproto/jsync

- sync json files
- should only be run from the command line

## TLDR

- main use cases is extending one json file from another, e.g. packag.jsons in a monorepo

  1. install `pnpm add @nodperoto/jsync`
  2. add `"jsync": { "root": false }` to your child pkg.json and `"root": true"` to some parent (e.g. monorepo root) package.json
  3. add pkg json script `"jsync": NODE_OPTIONS=\"--experimental-specifier-resolution=node\" jsync`
  4. run the pkg json script `pnpm jsync`

# inspiration

original idea taken from `dry-dry`, but honorable mentions

- [dry-dry](https://github.com/Cosium/dry-dry)
- [read json](https://github.com/sindresorhus/read-pkg/blob/main/index.js)
- [pnpm meta-updator](https://github.com/pnpm/meta-updater)

# vscode

- [enable trailing commas in jsonc files](https://github.com/microsoft/vscode/issues/102061)
