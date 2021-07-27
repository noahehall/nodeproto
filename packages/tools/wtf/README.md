# TLDR
  - where the FK?
  - file locations and things

# import dependencies
  - [readdir](https://github.com/folder/readdir)
  - [jsonc](https://github.com/fabiospampinato/jsonc-simple-parser/blob/master/test/lib/index.js)


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

    dirs.JSONC
      .lookup
      .stringify
      .strip // strip new lines but keep comments?
      .validate // validate jsonc?
      .parse // convert to json
  ```
