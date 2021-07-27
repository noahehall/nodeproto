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
  - [another jsonc parser](https://www.npmjs.com/package/jsonc)


# vscode
  - [enable trailing commas in jsonc files](https://github.com/microsoft/vscode/issues/102061)


# nomenclature
  - `packageFile` `package.jsonc` or `package.json` file
  - either the file must contain a `jsync` property
    - `package.jsonc` overrides `package.json` if it exists

# workflow
  - extending json files
    - every package must start with a standard `package.json`
    - a `packageFile.jsync.root: true` must be found
    - a  `package.jsonc` file will be upserted in each directory that contains a `packageFile` with a `jsync` propertyin the merged
    - all `packageFiles` files will be updated based on the final set of rules defined by merging `{..child, ..parent}.jsync` property
    - file locations will be saved in each `packageFile.jsync.locations` property
    - TODO
      - a hash of each `packageFile` file will be saved in each `packageFile.jsync.hash` property for quicker upserts
      - changelist will be saved in each `packaeFile.jsync.changelist` property


# .jsync.json
  - a standard jsonc file
  - ensure your editor reads it as such
