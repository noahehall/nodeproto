# @nodeproto/configproto - swc configs

- you should prefer swc for is simplicity and raw speed
- use whenever you:
  - dont need a particular babel plugin or swc is too buggy
  - dont use flow
    - if you do
      - you need to double transpile (flow-remove-types > swc)
      - you need to configure eslint + flow (see eslint docs in this repo)
  - [dont use eslint](https://github.com/swc-project/swc/issues/246)
    - if you do: you need to run eslint as a separate build step
    -


# NOTES

- the docs are invalid, find a working config and stick to it ;)
- general config
  - whenever you get `unmatched data` means the you specified an incorrect value
  - it says to refer to terser options for mangle & compress
    - however you cant use the options as specified in terser docs
    - i believe what they mean is refer to terser docs for definitions, but not for available options
      - i.e. only use the options specified in swc, but refer to terser docs for the definitions

- node config
  - dont use these options: no matter what value you provide (buggy for me at least)
    - compress
      - "exportNameSpaceFrom"
      - "keepClassNames"
      - "defaults": true,
      - "drop_console": false,
      - "expression": false,
      - "ie8": false,
      - "keep_fnames": false,
      -  "module": false, // all files are treated as module
   -  mangle
      -"keep_fnames": false,
      "ie8": false, // ignored
      "safari10": false, // not implemented
      "eval": false,
      "module": false,
      "reserved": [],