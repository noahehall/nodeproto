# flowtype arch

- often a single source of truth in a monorepo is a huge win for dev experience:
  - each package should have `src/libdefs/*.js`
  - the `index.js` should export all sibling/child types
  - the `src/libdefs/index.js` should be included in package exports, e.g. `package.json.exports['./libdefs'] = ./src/libdefs/index.js`
  - all external/internal type definitions to be shared across boundaries should always be imported as `import type { poop } from '../libdefs'`
  - FYI: unfortunately subpath imports doesnt seem to work with flow :(
