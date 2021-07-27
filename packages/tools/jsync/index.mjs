import { Diff } from 'diff';
import { getDirs } from '@nodeproto/wtf';


const dirs = getDirs();

console.log('\n\n wtf is package.jsonc', await dirs.getPkgJsonc());
console.log('\n\n wtf is package.json', await dirs.getPkgJson());
console.log('\n\n wtf is root package.json', await dirs.getPkgJson('../../..'));
// console.log('\n\n wtf are dirs', getDirs())

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
