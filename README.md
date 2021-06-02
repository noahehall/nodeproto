# @nodeproto
  - lerna monorepo for rapidly prototyping complex applications and microservices

## TLDR
  - I started from scratch so you dont have to

## stable scripts
  - in general
    - every cmd comes with a `npm run DO:THIS:HELP` to see the help
  - the scripts
    - `npm run lerna:help` see lerna help
    - `npm run bootstrap` install dependencies in each package + hoisting common ones
    - `npm run start` run the start script in each package for development
    - `npm run test` run the test script in each package

## adding packages
  - `npm run add NPMPACKAGE packages/PKG`
    - e.g. `npm run add webpack-bundle-analyzer packages/client -- -D`
      - will install webpack-bundle-analyzer into packages/client
    - issues
      - you can only add ONE package at a time, i know wtf!
      - `--save-exact` isnt working, will figure this out later

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

  - bundling
    - [esbuild for backend](https://esbuild.github.io)
      - [always review this first b4 intalling babel plugins](https://esbuild.github.io/content-types/#javascript)
    - [webpack 5 + esbuild for frontend](https://webpack.js.org/)
      - frontend requires complex bundling to support the widerange of environment i prefer to build for.
      - thus we use both webpack 5 + esbuild
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




