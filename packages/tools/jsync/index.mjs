import JSONC from 'jsonc-simple-parser';
import diff from 'diff';

/**
  - required files
    .jsync.jsonc
    package.json
    package.jsonc

  - import required files
    - import required files that exist in this dir

    - if this dir is not the root
      - find the root dir
        - import root dirs required files

old notes
 - if `package.jsonc` doesnt exist
      1. verify `.jsync` jsonc config file
      2. copy `package.json` to `package.jsonc`
      3. follow rules in `.jsync`
      4. save new `package.jsonc`
      5. update existing `package.json`

    - if `package.jsonc` does exist
      1. verify `.jsync` jsonc config file
      2. `diff` `package.jsonc` with `package.json`
         1. for any changes, follow rules in `.jsync` jsonc config file
      3. update existing `package.jsonc`
      4. update existing `package.json`

*/
