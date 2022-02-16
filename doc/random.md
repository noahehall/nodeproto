```sh
# displays the config used to transpile some file when running a pkg json script
BABEL_SHOW_CONFIG_FOR=absolute/path/to/file somePkgJsonScriptName

# a pkg json script when I was support cjs, but node 16 LTS should be the target transpiled so this is no longer relevant
"repo:cp:cjs": "rm -f ./dist/package.json && mkdir -p dist && cp ./node_modules/@nodeproto/configproto/src/node/cjs.json ./dist/package.json",

# pkg json script to convert dist/*.js files to dist/*cjs files
"js:to:cjs": "for f in ./dist/**/*.js; do mv -- \"$f\" \"${f%.js}.cjs\"; done",

# node doenst like the {} syntax i guess
"repo:cp:configproto": "cp ./node_modules/@nodeproto/configproto/{.browserslistrc,.flowconfig,.prettier*} .",
```
