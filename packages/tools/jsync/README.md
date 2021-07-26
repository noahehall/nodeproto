# @nodeproto/jsync
  - sync json files
  - idea taken from the awesome `dry-dry` pkg manager


# TLDR
  - main use cases is extending one json file from another, e.g. packag.jsons in a monorepo

# inspiration
  - [read json](https://github.com/sindresorhus/read-pkg/blob/main/index.js)
  - [dry-dry](https://github.com/Cosium/dry-dry)

# important dependencies
  - [normalize-package-data](https://github.com/npm/normalize-package-data)
  - [jsdiff](https://github.com/kpdecker/jsdiff#readme)
  - [jsonc-simple-parser](https://github.com/fabiospampinato/jsonc-simple-parser)


## potentials
  - [parse-json](https://www.npmjs.com/package/parse-json)
    - we should work with jsonc instead
  - [jora object query](https://github.com/discoveryjs/jora#readme)
  - [json-merger](https://github.com/boschni/json-merger)


# vscode
  - [enable trailing commas in jsonc files](https://github.com/microsoft/vscode/issues/102061)


# nomenclature
  - `package file` a `.jsync.jsonc`, `package.jsonc` or `package.json` file
  - `.jsync.jsonc` configuration file for `@nodeproto/jsync`

# workflow
  - extending json files
    - every package must start with a standard `package.json` and a `.jsync.json` file with `"root": true` must be found


# .jsync.json
  - a standard jsonc file
  - ensure your editor reads it as such
