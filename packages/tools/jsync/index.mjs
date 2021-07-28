import { Diff } from 'diff';
import { getDirs } from '@nodeproto/wtf';

const isObject = (v) => typeof v === 'object' && v !== null;
const notArrayOrObject = (v) => !isObject(v) || !Array.isArray(v);
const dirs = getDirs();

let newChildJson = {}
let newRootJson = {};

// TODO: @see @nodeproto/inception
const throwIt = msg => { throw msg };
// TODO: @see @nodeproto/inception
const noop = () => void 0;
const logIt = process.env.NODE_ENV === 'poop' ? noop : (...msgs) => console.log(...msgs)

// json field value categories
const VTS = 'valuesToSpread';
const VTF = 'valuesToForce';
const VTI = 'valuesToIgnore';
const V = {}; // container for all the json segments

// TODO
// stamp this via build so we dont need to retrieve from disk
let JSYNC_DEFAULT_CONFIG = process.env.JSYNC_DEFAULT_CONFIG;

if (!JSYNC_DEFAULT_CONFIG) {
  const { file: thisPkgJson, path: thisPkgJsonPath } = (await dirs.getPkgJson());
  const { file: thisPkgJsonc, path: thisPkgJsoncPath } = (await dirs.getPkgJsonc());
  JSYNC_DEFAULT_CONFIG = thisPkgJsonc.jsync;
}

const getRootPkgFiles = async ({
  maxLookups = throwIt(`maxLookups is required in getRootPkgFiles`),
  currentDir = throwIt(`currentDir is required in getRootPkgFiles`),
}) => {
  if (!maxLookups) throwIt(`unable to find root packageFile in getRootPkgFiles`)

  const { file: json, path: jsonPath } = await dirs.getPkgJson(currentDir);

  return (json?.jsync?.root)
    ? { json, jsonPath }
    : getRootPkgFiles({
        currentDir: currentDir += '/..',
        maxLookups: --maxLookups,
      });
}

const finalizeJsyncConfig = (main, overrides) => ({ ...main, ...overrides });

// TODO: confirm env
const childPkgJsonPath = process.env.CHILD_PKG_JSON_PATH || process.cwd();
const childPkgJson = await dirs.getPkgJson(childPkgJsonPath);

// finalize child jsync config
if (!childPkgJson?.file?.jsync) throwIt(`invalid child package.json file ${childPkgJson}`);
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
logIt('\n\n final jsync', {rootJsync, ignoreRootValues, forceRootValues, spreadRootValues})

// values to ignore
V[VTI] = new Set(ignoreRootValues);
logIt('\n\n values to ignore', V[VTI])

// values to force
// these root values will be set in child package.json
V[VTF] = new Set(forceRootValues.filter(v => !V[VTI].has(v)));
logIt('\n\n values to force', V[VTF])

// these values will never be spread into child.package.json
const valuesToNeverSpread = new Set([...V[VTI]].concat([...V[VTF]]));
// these values will be spread into child from root
// values to spread
V[VTS] = new Set(
  spreadRootValues
    .filter(v => !valuesToNeverSpread.has(v))
);
logIt('\n\n values to spread', V[VTS]);

const getJsonFieldCategory = k => (
  (V[VTS].has(k) && VTS)
  || (V[VTF].has(k) && VTF)
  || VTI
);

const DEFAULT_CATEGORY = getJsonFieldCategory('*')
logIt('\n\n default category', DEFAULT_CATEGORY)

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
      ), // end object assign[=----------------------------------------------------------------------
      { [VTS]: [], [VTI]: [], [VTF]: [] } // base accumulator
  ) // end reduce
);

const rootJsonSegments = segmentJsonFieldsByCategory();
logIt('\n\n root json segments', rootJsonSegments)

const valuesUpdated = new Set(V[VTI]);
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

    valuesUpdated.add(k);

    if (!(k in toJson) || force) {
      newChildJson[k] = rootValue;

      continue;
    }

    // set the value if not an object/array
    if (notArrayOrObject(rootValue)) {
      if (notArrayOrObject(childValue))
        newChildJson[k] = rootValue;
      else
        newChildJson[k] = childValue;

      continue;
    }

    // take set of root & child values
    if (Array.isArray(rootValue)) {
      if (Array.isArray(childValue))
        newChildJson[k] = Array.from(new Set(rootValue.concat(childValue || [])));
      else
        newChildJson[k] = childValue;

      continue;
    }

    // using rudimentary check for object
    // but has to be an object based on previous checks
    if (isObject(rootValue)) {
      if (isObject(childValue))
        newChildJson[k] = { ...rootValue, ...(childValue || {}) };
      else
        newChildJson[k] = childValue;

      continue;
    }

    logIt('\n\n unkown value type', k, rootValue, childValue);
  }

  logIt('\n\n newChildJson', newChildJson);
}


// TODO: use whatever @nodeproto/wtf has for persisting files
// should be something out of fs-extra
const persistChildPkgJson = (pkgJson) => {

}

// spread values from root to child
await updateNewJson();
// force values from root to child
await updateNewJson({
  force: true,
  keys: rootJsonSegments[VTF],
});

// handle remaining root fields
const forceRemaingValues = DEFAULT_CATEGORY === VTF;
const remainingValues = Object.keys(rootJson).filter(k => !valuesUpdated.has(k));
await updateNewJson({
  force: forceRemaingValues,
  keys: remainingValues,
});

// handle remaining child fields
newChildJson = { ...newChildJson, ...childPkgJson.file };

console.log('\n\n new child json', newChildJson);
