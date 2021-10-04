import { wtf as wtfShared } from '@nodeproto/shared';

import fs from 'fs-extra';
import path from 'path';

const { dirname, getPkgJson, getPkgJsonc } = wtfShared;
const isObject = (v) => typeof v === 'object' && v !== null;
const notArrayOrObject = (v) => !isObject(v) && !Array.isArray(v);

// TODO: @see @nodeproto/inception
const throwIt = msg => { throw msg; };
// TODO: @see @nodeproto/inception
const noop = () => void 0;
const logIt = process.env.NODE_ENV !== 'verbose' ? noop : (...msgs) => console.log(...msgs);

let newChildJson = {};

// json field value categories
const VTS = 'valuesToSpread';
const VTF = 'valuesToForce';
const VTI = 'valuesToIgnore';
const V = {}; // container for all the json segments

// TODO
// stamp this via build so we dont need to retrieve from disk
let JSYNC_DEFAULT_CONFIG = process.env.JSYNC_DEFAULT_CONFIG;

if (!JSYNC_DEFAULT_CONFIG) {
  const diskPath = path.resolve(dirname(import.meta.url), '..');

  // const { file: thisPkgJson, path: thisPkgJsonPath } = (await getPkgJson(diskPath));
  const { file: thisPkgJsonc/*, path: thisPkgJsoncPath*/ } = (await getPkgJsonc(diskPath));

  JSYNC_DEFAULT_CONFIG = thisPkgJsonc.jsync;
}

const getRootPkgFiles = async ({
  maxLookups = throwIt(`maxLookups is required in getRootPkgFiles`),
  currentDir = throwIt(`currentDir is required in getRootPkgFiles`),
}) => {
  if (!maxLookups) throwIt(`unable to find root packageFile in getRootPkgFiles`);

  const { file: json, path: jsonPath } = await getPkgJson(currentDir);

  return (json?.jsync?.root)
    ? { json, jsonPath }
    : getRootPkgFiles({
        currentDir: currentDir += '/..',
        maxLookups: --maxLookups,
      });
};

const finalizeJsyncConfig = (main, overrides) => ({ ...main, ...overrides });

// TODO: confirm env
const childPkgJsonPath = process.env.CHILD_PKG_JSON_PATH || process.cwd();
const childPkgJson = await getPkgJson(childPkgJsonPath);
logIt('\n\n child pkgjson', childPkgJson);

// finalize child jsync config
if (!childPkgJson?.file?.jsync) throwIt(`invalid child package.json file: missing jsync property ${childPkgJson}`);
const useChildJsyncConfig = finalizeJsyncConfig(JSYNC_DEFAULT_CONFIG, childPkgJson.file.jsync);
logIt('\n\n final child jsync', useChildJsyncConfig);

// retrieve root jsync config
const {
  json: { jsync: rootJsync, ...rootJson },
  jsonPath: rootPath
} = await getRootPkgFiles({
    maxLookups: useChildJsyncConfig.maxLookups,
    currentDir: '..', // start in parent dir
  });
logIt('\n\n root json', rootJson, rootPath );

// the jsync config to use for this parent-child relationship
const {
  ignoreRootValues = [],
  forceRootValues = [],
  spreadRootValues = [],
}  = finalizeJsyncConfig(rootJsync, useChildJsyncConfig);
logIt('\n\n final jsync', { rootJsync, ignoreRootValues, forceRootValues, spreadRootValues }); // eslint-disable-line sort-keys

// values to ignore
V[VTI] = new Set(ignoreRootValues);
logIt('\n\n values to ignore', V[VTI]);

// values to force
// these root values will be set in child package.json
V[VTF] = new Set(forceRootValues.filter(v => !V[VTI].has(v)));
logIt('\n\n values to force', V[VTF]);

// these values will never be spread into child.package.json
const valuesToNeverSpread = new Set([...V[VTI]].concat([...V[VTF]]));

// these values will be spread into child from root
// values to spread
V[VTS] = new Set(spreadRootValues.filter(v => !valuesToNeverSpread.has(v)));
logIt('\n\n values to spread', V[VTS]);

const getJsonFieldCategory = k => (
  (V[VTS].has(k) && VTS)
  || (V[VTF].has(k) && VTF)
  || VTI
);

const DEFAULT_CATEGORY = getJsonFieldCategory('*');
logIt('\n\n default category', DEFAULT_CATEGORY);

let category;
const segmentJsonFieldsByCategory = (json = rootJson) => (
  Object
    .keys(json)
    .reduce((acc, k) => Object.assign(
      acc, // mutated each time
      (
        category = getJsonFieldCategory(k), // comma operator
        {
          [category]: acc[category].concat(k) // injected into acc
        })
      ), // end object assign
      { [VTS]: [], [VTI]: [], [VTF]: [] } // base accumulator
  ) // end reduce
);

const rootJsonSegments = segmentJsonFieldsByCategory();
logIt('\n\n root json segments', rootJsonSegments);

// TODO: need to define logic when root & child have different value types
// ^  root takes precendence if missing from child or child has same value type as root
// ^  child takes precedence in all other cases
const updateNewJson = async ({
  keys = rootJsonSegments[VTS],
  fromJson = rootJson,
  toJson = childPkgJson.file,
  force = false
} = {}) => {
  for (const k of keys) {
    const rootValue = fromJson[k];
    const childValue = toJson[k];
    const missing = !(k in toJson);

    // set the value if forced or missing
    if (force || missing) {
      newChildJson[k] = rootValue;

      V[VTI].add(k);
    }

    if (V[VTI].has(k)) continue;
    // set the value only if missing: use force above to override
    else if (notArrayOrObject(rootValue)) {
      if (notArrayOrObject(childValue) && missing)
        newChildJson[k] = rootValue;
      else
        newChildJson[k] = childValue;
    }
    // take set of root & child values
    else if (Array.isArray(rootValue)) {
      if (Array.isArray(childValue))
        newChildJson[k] = Array.from(new Set(rootValue.concat(childValue || [])));
      else
        newChildJson[k] = childValue;
    }
    // using rudimentary check for object
    // but has to be an object based on previous checks
    else if (isObject(rootValue)) {
      if (isObject(childValue))
        // root takes precedence to get updated values (if any) on subsequent runs
        newChildJson[k] = { ...(childValue || {}), ...rootValue };
      else
        newChildJson[k] = childValue;
    }

    else logIt('\n\n unkown value type', k, rootValue, childValue);

    V[VTI].add(k);
  }

  logIt('\n\n newChildJson', newChildJson);
};

// force values from root to child
await updateNewJson({
  force: true,
  keys: rootJsonSegments[VTF],
});
// spread values from root to child
await updateNewJson({
  force: false,
  keys: rootJsonSegments[VTS],
});

// handle remaining root fields
await updateNewJson({
  force: DEFAULT_CATEGORY === VTF,
  keys: Object.keys(rootJson).filter(k => !V[VTI].has(k)),
});
// use remaining values in childPkgJson as defualt
// but override with new values on clash
newChildJson = { ...childPkgJson.file, ...newChildJson };

logIt('\n\n new child json', newChildJson);

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
const sortSimpleThenComplexDataTypes = (a, b) => {
  // sort simple types before complex types
  if (notArrayOrObject(a[1]) && notArrayOrObject(b[1])) {
    return a[0].localeCompare(b[0]);
  }

  // sort the simple type before the complex type
  if (notArrayOrObject(a[1])) return -1;
  else if (notArrayOrObject(b[1])) return 1;
  // sort complex types alphabetically
  else return a[0].localeCompare(b[0]);
};

const sortArraysAndObjects = (key, value) => (
  notArrayOrObject(value) || key === 'exports'
    ? value
    : Array.isArray(value)
      ? value.sort((a, b) => a.localeCompare(b))
      : Object.entries(value).sort((a, b) => a[0].localeCompare(b[0])).reduce(
        (obj, [key, value]) => (obj[key] = value, obj),
        {}
      )
);

// @see https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
await fs.outputJson(
  childPkgJsonPath + '/package.json',
  Object.entries(newChildJson).sort(sortSimpleThenComplexDataTypes).reduce(
    (obj, [key, value]) => (obj[key] = sortArraysAndObjects(key, value), obj),
    {}
  ),
  { spaces: 2 }
);
