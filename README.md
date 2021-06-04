# @nodeproto
  - lerna monorepo for rapidly prototyping complex applications and microservices

## TLDR
  - I started from scratch so you dont have to

## common tasks
### stable scripts
  - in general
    - every cmd comes with a `npm run DO:THIS:HELP` to see the help
  - the scripts
    - `npm run lerna:help` see lerna help
    - `npm run bootstrap` install dependencies in each package + hoisting common ones
    - `npm start` run the start script in each package for development
    - `npm run test` run the test script in each package
    - `npm run lerna:run RUNSCRIPT` run an arbitrary script in all packages with the matching RUNSCRIPT name

### adding packages
  - `npm run add NPMPACKAGE packages/PKG`
    - e.g. `npm run add webpack-bundle-analyzer packages/client -- -D`
      - will install webpack-bundle-analyzer into packages/client
    - issues
      - you can only add ONE package at a time, i know wtf!
      - `--save-exact` isnt working, will figure this out later


### environment variables
  - each *package/package.json* should contain a `config` section with the default (and *public*) environment variables
    - *do not* create an `.env.example` - use the `package/package.json.config` section
  - create a `package/.env` file with environment variables you want to use in each microservice, referencing the name and values in the `package/package.json.config`


## dependencies
### dotfiles
  - [editorconfig](https://editorconfig.org/)
  - [gitignore](https://git-scm.com/docs/gitignore)
  - [gitattributes](https://git-scm.com/docs/gitattributes)
  - [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
  - [nvmrc](https://github.com/nvm-sh/nvm)
  - [hintrc](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/configuring-webhint/summary.md)


### modules
#### stable
  - pkg management
    - [lerna](https://github.com/lerna/lerna/tree/main/commands)
    - [npm](npmjs.com/)

  - backend
    - [koa](https://koajs.com/#introduction)
      - [koa-body](https://github.com/koajs/koa-body/blob/9b00b40adbfc40a5f5f73efbc88108adf66bcf8b/index.js#L75)
      - [koa-compose](https://github.com/koajs/compose/blob/25568a36509fefc58914bc2a7600f787b16aa0df/index.js#L19)
      - [koa-jwt](https://github.com/koajs/jwt#example)
      - [koa-session](https://github.com/koajs/session#example)
      - [koa-helmet](https://github.com/venables/koa-helmet)
      - [@koa/cors](https://github.com/koajs/cors)
      - [koa-ratelimit](https://github.com/koajs/ratelimit)
      - [koa-oas3](https://github.com/atlassian/koa-oas3)


  - tooling
    - [esbuild for apis](https://esbuild.github.io)
      - [always review this first b4 intalling babel plugins](https://esbuild.github.io/content-types/#javascript)
    - [webpack 5 + esbuild for client](https://webpack.js.org/)
      - frontend requires complex bundling to support a wide range of environments.
      - thus we use both webpack 5 + esbuild
    - [es-main](https://github.com/tschaub/es-main/blob/main/test.js)

  - frontend
    - [messageformat](https://github.com//messageformat)
    - [react](https://reactjs.org)

  - css
    - [normalize.css](https://github.com/necolas/normalize.css/)
    - [modernizr](https://github.com/Modernizr/Modernizr)

  - testing
    - [tape](https://github.com/substack/tape)
    - [multi-tape](https://github.com/mattiash/node-multi-tape)
    - [sinon](https://sinonjs.org/)

  - linting
    - [webhint/hint](https://github.com/webhintio/hint)

##### testing out
  - testing

  - misc

  - file serving
    - [koajs/favicon](https://github.com/koajs/favicon)

  - monitoring
    - [cls-rtracer](https://github.com/puzpuzpuz/cls-rtracer)

  - webpack
    - [esbuild-loader](https://github.com/privatenumber/esbuild-loader)


  - caching
    - [tinyhttp/etag](https://github.com/talentlessguy/tinyhttp/blob/348e95e8cee63c0f03eea46495f26d863315e1f0/packages/etag/src/index.ts#L27)

  - security
    - [koa-sslify](https://github.com/turboMaCk/koa-sslify)

  - routing
    - [koa-tree-router](https://github.com/steambap/koa-tree-router)
    - [joi-routing](https://github.com/koajs/joi-router)
    - [koa-router](https://github.com/koajs/router/tree/master/lib)




