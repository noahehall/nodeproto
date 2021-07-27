# TLDR
  - where the FK?
  - file locations and things

# import dependencies
  - [readdir](https://github.com/folder/readdir)
# examples
  ```js
    // get the pkg json file in the current directory
    await dirs.getPkgJson()
    // get the pkg json in the parent directory
    await dirs.getPkgJson('..')
    // get the root pkg json file of @nodeproto from within @nodeprot/jsync
    await dirs.getPkgJson('../../..')
    // similarly, get the pkg jsonc file in the current directory
    await dirs.getPkgJsonc()


  ```
