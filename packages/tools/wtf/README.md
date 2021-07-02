# TLDR
  - where the FK?
  - file locations and things

# import dependencies
  - [readdir](https://github.com/folder/readdir)
  - [jsonc](https://github.com/fabiospampinato/jsonc-simple-parser/blob/master/test/lib/index.js)


# examples
  ```js
    // get the pkg json file in the current directory
    await wtf.getPkgJson()
    // get the pkg json in the parent directory
    await wtf.getPkgJson('..')
    // get the root pkg json file of @nodeproto from within @nodeprot/jsync
    await wtf.getPkgJson('../../..')
    // similarly, get the pkg jsonc file in the current directory
    await wtf.getPkgJsonc()

    // can be used in .mjs|cjs files
    await wtf.dirname(import.meta?.url)
    await wtf.filename(import.meta?.url)

    wtf.JSONC
      .lookup
      .stringify
      .strip // strip new lines but keep comments?
      .validate // validate jsonc?
      .parse // convert to json

    wtf.fs
      // @see https://github.com/jprichardson/node-fs-extra
      .readJson[Sync]
  ```
