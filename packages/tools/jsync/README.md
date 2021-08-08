# @nodeproto/jsync
  - sync json files
  - idea taken from the awesome `dry-dry` pkg manager


## TLDR
  - main use cases is extending one json file from another, e.g. packag.jsons in a monorepo
  1. install globally/`npm link` if developing `jsync` locally
  2. add `"jsync": { "root": false }` to your child pkg.json and `"rooot": true"` to some parent (e.g. monorepo root) package.json
  3. `@nodeproto/jsync` will now automatically update your package.json file whenever you run `pnpm install` or related cmds
  4. you can force sync via `$ jsync`

# inspiration
  - [read json](https://github.com/sindresorhus/read-pkg/blob/main/index.js)
  - [dry-dry](https://github.com/Cosium/dry-dry)
  - [pnpm meta-updator](https://github.com/pnpm/meta-updater)

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
  - [microsofts jsonc parser](https://github.com/microsoft/node-jsonc-parser)
    - will likely have to go with this one


# vscode
  - [enable trailing commas in jsonc files](https://github.com/microsoft/vscode/issues/102061)


# workflow
  - extending json files
    - every package must start with a standard `package.json`
    - a `packageFile.jsync.root: true` must be found

    - all `package.json` files will be updated based on the final set of rules defined by merging `{..child, ..parent}.jsync` property
    - file locations will be saved in each `packageFile.jsync.locations` property
    - `child.jsync.parent.hash` and `parent.jsync[childName].hash` will be updated on each upsert to shortcut logic and speed up subsequential checks

    - TODO
      - changelist will be saved in each `packaeFile.jsync.changelist` property
      - support `package.jsonc` via `microsoft/jsonc-updater-thing` pkg

# todos
  - bring over error handling logic from inception
