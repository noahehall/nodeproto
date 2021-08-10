# long list of todos in one place
## TODOS
  - add [YEOMAN for scaffolding new microservices](https://yeoman.io/)
  - move esbuild popcopy plugin to packages/@nodeproto/esbuild-popcopy-plugin
  - [run npm via script to provide some default node options for all pkgjson scripts](https://nodejs.org/api/cli.html)
  - error handling
  - review installed dependencies
  - [finish setting up webhint](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/hints/index.md)
  - [switch to intern test framework](https://github.com/theintern/intern)
  - [setup globalize](https://github.com/globalizejs/globalize/tree/master/examples/node-npm)
  - [setup react + amp](https://medium.com/@rtymchyk/react-amp-modern-approach-e45de3fe84c7)
  - [move to htmlwebpackplugin template](https://github.com/jantimon/html-webpack-plugin#writing-your-own-templates)
    - so we can reuse pkgjson.confg and .env values inside template
      - e.g. id='root' should id='process.env.REACT_APP_ID'
  - need a bash script to find a replace things
    - e.g. when changing API_PORT to API_HTTP_PORT would be great to do this from a script instead of an editor
  - remove dotenv from all packages except @nodeprot/lib
    - require @nodeproto/lib/envproto on the cmd line and it should accept a package.json path argument and use it to update the env
    - think about a `--upsert config` argument that allows us to use the pkg.json.config values even if they are missing from .env
      - currently you have to set `config.KEY=` in `.env` to upsert the values, but this isnt DRY
  - ensure we are using appropriate [pkgjson fields](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
  - finish setting up haproxy
    - ssl termination
    - integration with @nodeprot/lib/envproto.getdevserts thing
  - [pick our default detections @ modernizr](https://modernizr.com/download?setclasses)
  - [think babel-eslint is canceling out standard-js rules](https://github.com/babel/eslint-plugin-babel)
  - [see if theres any merit to this](https://www.npmjs.com/package/accessibility-checker)
  - [checkout the merits of this](https://github.com/Siteimprove/alfa)
  - had to remove from pkgcheck
    - "create-hintrc": "3.0.11",
    - "hint": "6.1.3",
  - dont need both env-cmd and dotenv
  - rush should only isntall ONCE, not 3 fkn retires if failure
  - removed from client
    - "create-hintrc": "3.0.11",
    - "hint": "6.1.3",

  - babeloptions cant find babel.config.cjs but eslint works so fk it
    - might be vscode
      ```sh
          Parsing error: Cannot find module './lib/babel.config.cjs'
          Require stack:
      ```
  - need to move eslint and babelrc shit to library/utils and extend from them inside other pkgs
  - [finish setting up opentelemetry](https://github.com/open-telemetry/opentelemetry-js-api)
  - need to setup multi compiler for client ot support module/nomodule, check babel.config.cjs todo
  - need to lazy load routesin app/client
  - [how the fk do i override env var via env-cmd](https://github.com/toddbluhm/env-cmd/issues/300)
  - [make this shit into a real plugin](https://www.npmjs.com/package/esbuild-plugin-flow)
  - [review this dope way of using reflect on module exports](https://github.com/jonschlinkert/global-modules/blob/master/index.js)
    - when you import it, it only returns a string as expected from the code
  - [finish settin gup tabine](https://www.tabnine.com/welcome)
  - [checkout putout](https://github.com/coderaiser/putout)
  - [awesome codemods](http://www.lib4dev.in/info/rajasegar/awesome-codemods/227242829)
  - [implement the new jsx transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports)

## DONE
  - defaults from pkg.json.config not being used
    - you shouldnt have to set identical vars in pkg.json.env if the value is set in pkg.json.config
    - have load .env via a .js file to upsert values both ways
    -
