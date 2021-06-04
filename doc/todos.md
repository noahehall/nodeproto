# long list of todos in one place

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
  - defaults from pkg.json.config not being used
    - you shouldnt have to set identical vars in pkg.json.env if the value is set in pkg.json.config
    - have load .env via a .js file to upsert values both ways
