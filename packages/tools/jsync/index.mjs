import { Diff } from 'diff';
import { getDirs } from '@nodeproto/wtf';

const dirs = getDirs();

// TODO: everywhere throw should be an error, see @nodeproto/inception
const throwIt = msg => { throw msg };

// TODO
// for prod
// stamp this via build so we dont need to retrieve from disk
let JSYNC_DEFAULT_CONFIG = process.env.JSYNC_DEFAULT_CONFIG;


if (!JSYNC_DEFAULT_CONFIG) {
  // const { file: thisPkgJson, path: thisPkgJsonPath } = (await dirs.getPkgJson());
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
console.log('\n\n final child jsync', useChildJsyncConfig);

// retrieve root jsync config
const {
  json: { jsync: rootJsync, ...rootJson },
  jsonPath: rootPath
} = await getRootPkgFiles({
    maxLookups: useChildJsyncConfig.maxLookups,
    currentDir: '..', // start in parent dir
  });
console.log('\n\n root json', rootJson, rootPath );

// the jsync config to use for this parent-child relationship
const {
  ignoreRootValues = [],
  forceRootValues = [],
  spreadRootValues = [],
}  = finalizeJsyncConfig(rootJsync, useChildJsyncConfig);
console.log('\n\n final jsync', {rootJsync, ignoreRootValues, forceRootValues, spreadRootValues})

const valuesToIgnore = new Set(ignoreRootValues.map(v => v.toLowerCase()));
console.log('\n\n values to ignore', valuesToIgnore)

// these root values will be set in child package.json
const forceRootValuesLowerCase = forceRootValues.map(v => v.toLowerCase());
const valuesToForce = new Set(forceRootValuesLowerCase.filter(v => !valuesToIgnore.has(v)));
console.log('\n\n values to force', valuesToForce)

// these values will never be spread into child.package.json
const valuesToNeverSpread = new Set([...valuesToIgnore].concat([...valuesToForce]));
console.log('\n\n never spread values', valuesToNeverSpread)

// these values will be spread into child from root
const valuesToSpread = new Set(
  spreadRootValues
    .map(v => v.toLowerCase())
    .filter(v => !valuesToNeverSpread.has(v))
);
console.log('\n\n values to spread', valuesToSpread);

const VTS = 'valuesToSpread';
const VTF = 'valuesToForce';
const VTI = 'valuesToIgnore';

const getJsonFieldCategory = k => (
  (valuesToSpread.has(k) && VTS)
  || (valuesToForce.has(k) && VTF)
  || VTI
);

const DEFAULT_CATEGORY = getJsonFieldCategory('*')
console.log('\n\n default category', DEFAULT_CATEGORY)

let category;
const segmentJsonFieldsByCategory = (json = rootJson) => (
  Object
    .keys(json)
    .reduce((acc, k) => Object.assign(
      acc,
      (
        category = getJsonFieldCategory(k),
        {
          [category]: acc[category].concat(k)
        })
      ),
      { [VTS]: [], [VTI]: [], [VTF]: [] } // base accumulator
  ) // end reduce
);

const rootJsonSegments = segmentJsonFieldsByCategory();
console.log('\n\n root json segments', rootJsonSegments)

const spreadRootValuesIntoChild = (rootJson, childJson) => {

}

const forceRootValuesInChild = (rootJson, childJson) => {

}

const persistChildPkgJson = (pkgJson) => {

}
