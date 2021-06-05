# long list of todos in one place
## TODOS
  - add YEOMAN for scaffolding new microservices
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


## DONE
  - defaults from pkg.json.config not being used
    - you shouldnt have to set identical vars in pkg.json.env if the value is set in pkg.json.config
    - have load .env via a .js file to upsert values both ways
