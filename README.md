# @nodeproto
  - monorepo for rapidly prototyping end-to-end, complex, and secure applications and microservices


| tech stach |
| :----------: |
| <img src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" width="100" align="left" /><img src="https://www.openapis.org/wp-content/uploads/sites/3/2018/02/OpenAPI_Logo_Pantone-1.png" width="100" align="left" /><img src="https://cdn.haproxy.com/wp-content/uploads/2017/10/haproxy-weblogo.png" width="100" align="left" /><img src="https://nodejs.org/static/images/logo.svg" width="100" align="left" /><img src="https://github.com/evanw/esbuild/raw/master/images/wordmark.svg" width="100" align="left" /><img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="100" align="left" /><img src="https://hero35.com/stacks/react.svg" width="100" align="left" /><img src="https://raw.githubusercontent.com/koajs/koa/master/docs/logo.png" width="100" align="left" /><img src="https://user-images.githubusercontent.com/645641/79596653-38f81200-80e1-11ea-98cd-1c6a3bb5de51.png" width="100" align="left" /><img src="https://cdn.rawgit.com/standard/standard/master/badge.svg" width="100" align="left" /><img src="https://camo.githubusercontent.com/32657601b349b558831f32c553cb2c7734cb5ae89a2e8340afa314ea3b2116a0/68747470733a2f2f6d696c6c696772616d2e696f2f696d616765732f7468756d626e61696c2e706e67" width="100" align="left" />|


## getting started
  1. `rush update`
  2. `rushx select`
  3. open `localhost:7777`

## dependencies
  - until we get docker setup make sure you have **haproxy 2.4** installed
    - see *apps/gateway* for instructions
## common tasks
  - if something doesnt work [please check our todo list](./doc/todos.md)
    - likely we've listened a work around, if not, create a github issue
### stable scripts

  - the scripts
    - dev scripts: open browser to **localhost:7777**
      - **NOTE** all START scripts use **haproxy**
        - we dont drop priviledges in *DEV*, if you want, do the below
          - [to *START* as root, but dont *RUN* as root when using **packages/gateway**: click here to read why haproxy recommends this](https://cbonte.github.io/haproxy-dconv/2.4/management.html#13)

      - starting apps (in root dir)
        - `rushx select` select a script to run in each project
          - use this before any of the others and thank the guys at `rush-select`
        - `rush start` run the start script in each package for development
          - currently this doenst show the logs, use `npm run select` instead


      - running scripts in specific packages
        - typically you need to `cd PKGDIR/somepkg` before executing `rushx SCRIPTNAME`
        - `rushx start` inside an *apps/PKG* will run the start script for that particular pkg

      - linting & tests
        - `rushx test` inside an *{apps, libraries}/PKG* will run the test script for htat particular pkg

### TODO scripts
        - `npm run lighthouse` run and save lighthouse report to `packages/client/doc/lighthouse/localhost.html`
          - *packages/client* must be running on *localhost:7777*

### adding packages
  - `rush add -p PKGNAME --dev --exact -m`
    - add a pkg - you should be within a pkg and **not the root** dir
    - e.g. `cd apps/client && rush add -p webpack-bundle-analyzer packages/client --dev --exact -m`
      - will install webpack-bundle-analyzer into apps/client
  - to add a package from github
    - couldnt figure out how to do it via `rush add`
    - however this works if you edit the `package.json` directly
      - `"@reach/router": "https://github.com/noahehall/router",`



### environment variables
  - each *PKGDIR/pkg/package.json* should contain a `config` section with the default (and *public*) environment variables
    - *do not* create an `.env.example` - use the `PKGDIR/pkg/package.json.config` section
  - create a `PKGDIR/pkg/.env` file with environment variables you want to use in each microservice, referencing the name and values in the `PKGDIR/pkg/package.json.config`
    - to apply default values specified in `package.json.config` set the var name in the `.env` file to nothing, e.g. `API_HTTP_PORT=` and `@nodeproto/envproto.syncEnv` will update `process.env.API_HTTP_PORT` to the value specified in the `package.json.config`
      - if the the `.env` file has a value for the variable, it WILL NOT be updated!
        - this is so values set via CLI or `.env` take precedence over `package.json.config` values

  - **NODE_OPTIONS**
    - checkout *root/package.json.config*
    - all of your *PKGDIR/pkg/.env* files should include this, but be sure to use **single** and **not double** quotes

### enabling SSL
  - self-signed certificates auto created on dev

## dependencies
### dotfiles
  - [editorconfig](https://editorconfig.org/)
  - [gitignore](https://git-scm.com/docs/gitignore)
  - [gitattributes](https://git-scm.com/docs/gitattributes)
  - [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
  - [nvmrc](https://github.com/nvm-sh/nvm)
  - [hintrc](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/configuring-webhint/summary.md)
  - [eslintrc](https://eslint.org/docs/user-guide)

### import config files
  - [babelrc.config.mjs for client apps](/apps/client/lib/babel.config.mjs)



### modules
#### stable
  - pkg management
    - [rush](https://rushjs.io/pages/commands)
    - [pnpm]([npmjs.com/](https://github.com/pnpm/pnpm))

  - gateway
    - [haproxy](https://cbonte.github.io/haproxy-dconv/2.4/management.html)

  - api layer
    - [koa](https://koajs.com/#introduction)
      - [koa-body](https://github.com/koajs/koa-body/blob/9b00b40adbfc40a5f5f73efbc88108adf66bcf8b/index.js#L75)
      - [koa-compose](https://github.com/koajs/compose/blob/25568a36509fefc58914bc2a7600f787b16aa0df/index.js#L19)
      - [koa-jwt](https://github.com/koajs/jwt#example)
      - [koa-session](https://github.com/koajs/session#example)
      - [koa-helmet](https://github.com/venables/koa-helmet)
      - [@koa/cors](https://github.com/koajs/cors)
      - [koa-ratelimit](https://github.com/koajs/ratelimit)
      - [koa-oas3](https://github.com/atlassian/koa-oas3)

  - SSL/TLS
    - [pem](https://github.com/Dexus/pem/blob/master/test/pem.spec.js)

  - tooling
    - [esbuild for apis](https://esbuild.github.io)
      - [always review this first b4 intalling babel plugins](https://esbuild.github.io/content-types/#javascript)
    - [webpack 5 + esbuild for client](https://webpack.js.org/)
      - frontend requires complex bundling to support a wide range of environments.
      - thus we use both webpack 5 + esbuild
    - [es-main](https://github.com/tschaub/es-main/blob/main/test.js)
    - [concurrently](https://github.com/kimmobrunfeldt/concurrently)

  - testing
    - [purple-tape](https://github.com/mattiash/purple-tape/blob/master/lib/test.ts)
    - [multi-tape](https://github.com/mattiash/node-multi-tape)
    - [sinon](https://sinonjs.org/)

  - linting
    - [webhint/hint](https://github.com/webhintio/hint)
    - [standard](https://standardjs.com/#table-of-contents)
    - [eslint](https://eslint.org/docs/user-guide/configuring/)
      - react as we need to support react linting
      - standard (minus comma-dangle) + react
    - [lighthouse](https://github.com/GoogleChrome/lighthouse#cli-options)

  - UI
    - [react](https://reactjs.org)
    - [react-icons](https://react-icons.github.io/react-icons/)
    - [clsx](https://github.com/lukeed/clsx)
    - [react-helmet](https://github.com/nfl/react-helmet)
    - [react-devtools](https://www.npmjs.com/package/react-devtools)]


  - text & internationalization
    - [messageformat](https://github.com//messageformat)

  - feature detection
    - [modernizr](https://modernizr.com/download?setclasses)

  - css
    - [normalize.css](https://github.com/necolas/normalize.css/)
    - [milligram](https://milligram.io/)
    - [styled-components](https://styled-components.com/docs)

  - micro interactions & animations
    - [animate.css](https://animate.style/)

  - accessbility
    - we use both reakit + react-aria as they compliment each other and keep us from writing primitives
      - be sure to checkout both as:
        - doubt this list will stay up to date
        - we have an accurate representation of everything each provide
    - [reakit](https://reakit.io/)
    - [react-aria](https://react-spectrum.adobe.com/react-aria/)
    - [react-stately](https://react-spectrum.adobe.com/react-stately/getting-started.html)

| COMPONENT | [REACT-ARIA](https://react-spectrum.adobe.com/react-aria/getting-started.html) | [REAKIT](https://reakit.io/docs) |
| :-------: | :-------: | :-------: |
BREADCRUMBS | Y | N |
BUTTON | Y | Y |
CHECKBOX | Y | Y |
CHECKBOXGROUP | Y | N |
CLICKABLE   | N | Y |
COMBOBOX   | Y | N |
COMPOSITE   | N | Y |
DIALOG   | Y | Y |
DISCLOSURE   | N | Y |
DISMISSBUTTON   | Y | N |
FORM   | N | Y |
GRID  | N | Y |
GROUP   | N | Y |
ID   | Y | Y |
INPUT   | N | Y |
LISTBOX   | Y | N |
MENU   | Y | Y |
MENUTRIGGER   | Y | N |
METER   | Y | N |
MODAL   | Y | N |
NUMBERFIELD  | Y | N |
OVERLAY   | Y | N |
POPOVER   | N | Y |
PORTAL   | N | Y |
PROGRESSBAR   | Y | N |
RADIO   | N | Y |
RADIOGROUP   | Y | N |
ROLE   | N | Y |
SEARCHFIELD   | Y | N |
SELECT   | Y | N |
SEPARATOR   | Y | Y |
SLIDER   | Y | N |
SWITCH   | Y | N |
TAB   | N | Y |
TABBABLE   | N | Y |
TEXTFIELD   | Y | N |
TOGGLE   | Y | N |
TOOLBAR   | N | Y |
TOOLTIP   | Y | Y |
USELINK   | Y | N |
VISUALLYHIDDEN   | Y | Y |

