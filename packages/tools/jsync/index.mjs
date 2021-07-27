import { Diff } from 'diff';
import { getDirs } from '@nodeproto/wtf';


const dirs = getDirs();

// TODO
// for prod
// stamp this via build so we dont need to retrieve from disk
let jsyncDefault = process.env.JSYNC_DEFAULT_CONFIG;

// for dev purposes
if (!jsyncDefault) {
  const { file: thisPkgJson, path: thisPkgJsonPath } = (await dirs.getPkgJson());
  const { file: thisPkgJsonc, path: thisPkgJsoncPath } = (await dirs.getPkgJsonc());
  jsyncDefault = thisPkgJsonc.jsync;
}



const getRootPkgFiles = async () => {
  let maxLookups = jsyncDefault.maxLookups;
  let currentDir = '..';

  while (maxLookups) {
    // we only care about the pkgJson until we find the root
    // once we find the root we will check for package.jsonc
    const { file: json, path: jsonPath } = await dirs.getPkgJson(currentDir);
    if (json?.jsync?.root) {
      return { json, jsonPath };
    }

    currentDir += '/..';
    maxLookups--;
  }

  throw `unable to find root packageFile`
}

const finalizeJsyncConfig = (main, overrides) => ({ ...main, ...overrides });

const { json: { jsync: rootJsync, ...rootJson }, jsonPath: rootPath } = await getRootPkgFiles();
const rootJsyncFinal = finalizeJsyncConfig(jsyncDefault, rootJsync);

console.log('\n\n root json', rootJson, rootPath );
console.log('\n\n root jsync', rootJsync, rootJsyncFinal)

/**
  - required files
    package.json
    package.jsonc

  - import required files
    - import required files that exist in this dir

    - if this dir is not the root
      - find the root dir
        - import root dirs required files

old notes
 - if `package.jsonc` doesnt exist
      1. copy `package.json` to `package.jsonc`
      2. follow rules in `packageFile.jsync`
      3. save new `package.jsonc`
      4. update existing `package.json`

    - if `package.jsonc` does exist
      1. `diff` `package.jsonc` with `package.json`
         1. for any changes, follow rules in `.jsync` jsonc config file
      2. update existing `package.jsonc`
      3. update existing `package.json`

*/
