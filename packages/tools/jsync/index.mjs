import { Diff } from 'diff';
import { getDirs } from '@nodeproto/wtf';


const dirs = getDirs();


// TODO: @see @nodeproto/inception
const throwIt = msg => { throw msg };
// TODO: @see @nodeproto/inception
const noop = () => void 0;
const logIt = process.env.NODE_ENV === 'poop' ? noop : (...msgs) => console.log(...msgs)


// json field value categories
const VTS = 'valuesToSpread';
const VTF = 'valuesToForce';
const VTI = 'valuesToIgnore';
const V = {};


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


V[VTI] = new Set(ignoreRootValues.map(v => v.toLowerCase()));
logIt('\n\n values to ignore', V[VTI])


// these root values will be set in child package.json
const forceRootValuesLowerCase = forceRootValues.map(v => v.toLowerCase());
V[VTF] = new Set(forceRootValuesLowerCase.filter(v => !V[VTI].has(v)));
logIt('\n\n values to force', V[VTF])


// these values will never be spread into child.package.json
const valuesToNeverSpread = new Set([...V[VTI]].concat([...V[VTF]]));
logIt('\n\n never spread values', valuesToNeverSpread)


// these values will be spread into child from root
V[VTS] = new Set(
  spreadRootValues
    .map(v => v.toLowerCase())
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


const spreadRootValuesIntoChild = ({
  fromJson = rootJsonSegments[VTS],
  toJson = thisPkgJson
} = {}) => {
  // get all spreadable entries in fromJson
  // if key is not in toJson, set it and forget it
  // if value is stirng, ignore it (dont concat strings
  // if value is object, spread it
  // if value is array, take union
}


const forceRootValuesInChild = ({
  fromJson = rootJsonSegments[VTF],
  toJson = thisPkgJson,
} = {}) => {
  // set it and forget it
}


// TODO: use whatever @nodeproto/wtf has for persisting files
// should be something out of fs-extra
const persistChildPkgJson = (pkgJson) => {

}
