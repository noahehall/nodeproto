# support us!
  - [buy me a starbook](https://us.starlabs.systems/)


# @nodeproto
  - bleeding-edge monorepo for rapidly prototyping end-to-end, complex, and secure applications and microservices


| tech stach |
| :----------: |
| <img src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" width="100" align="left" /><img src="https://www.openapis.org/wp-content/uploads/sites/3/2018/02/OpenAPI_Logo_Pantone-1.png" width="100" align="left" /><img src="https://cdn.haproxy.com/wp-content/uploads/2017/10/haproxy-weblogo.png" width="100" align="left" /><img src="https://nodejs.org/static/images/logo.svg" width="100" align="left" /><img src="https://github.com/evanw/esbuild/raw/master/images/wordmark.svg" width="100" align="left" /><img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="100" align="left" /><img src="https://hero35.com/stacks/react.svg" width="100" align="left" /><img src="https://raw.githubusercontent.com/koajs/koa/master/docs/logo.png" width="100" align="left" /><img src="https://user-images.githubusercontent.com/645641/79596653-38f81200-80e1-11ea-98cd-1c6a3bb5de51.png" width="100" align="left" /><img src="https://cdn.rawgit.com/standard/standard/master/badge.svg" width="100" align="left" /><img src="https://camo.githubusercontent.com/32657601b349b558831f32c553cb2c7734cb5ae89a2e8340afa314ea3b2116a0/68747470733a2f2f6d696c6c696772616d2e696f2f696d616765732f7468756d626e61696c2e706e67" width="100" align="left" />|


## getting started
<details>
  <summary> installation and starting </summary>

  1. `npm install -g @microsoft/rush` *install rush*
  2. `npm i -g dry-dry` *install dry pkg manager*
  3. [configure your git username & email](https://support.atlassian.com/bitbucket-cloud/docs/configure-your-dvcs-username-for-commits/)
    - you should do this even if your not using this starterkit
    - *$ git config --global user.name "fname lname"*
    - *$ git config --global "your_github_username@users.noreply.github.com"*
  4. `dry --dry-keep-package-json --dry-packager=pnpm i` *install dependencies*
  5. `rush update` *install npm dependencies in all pkgs*
  6. `rushx select` *choose start cmd in all pkgs where its available*
  7. open `localhost:7777`
</details>

<details>
  <summary> gotchas </summary>

  - until we get docker setup make sure you have **haproxy 2.4** installed
    - see *apps/gateway* for instructions
  - if something doesnt work [please check our todo list](./doc/todos.md)
    - likely we've provided a work around, if not, create a github issue!

</details>


## important files and locations
<details>
  <summary> directories </summary>

  - *root/apps* main applications
  - *root/libraries* libraries used by applications
  - *root/common* rushjs configuration
  - *root/doc* various docuemntation
</details>

<details>
  <summary> dotfiles </summary>

  - [editorconfig](https://editorconfig.org/)
  - [gitignore](https://git-scm.com/docs/gitignore)
  - [gitattributes](https://git-scm.com/docs/gitattributes)
  - [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
  - [nvmrc](https://github.com/nvm-sh/nvm)
  - [hintrc](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/configuring-webhint/summary.md)
  - [eslintrc](https://eslint.org/docs/user-guide)
  - [flowconfig](https://flow.org/en/docs/config/)
</details>

<details>
  <summary> configuration </summary>

  - [babelrc.config.mjs for client apps](/apps/client/lib/babel.config.cjs)
  - [our vscodium settings via sync settings extension](https://gist.github.com/noahehall/33f60c724f51bde9afa2c2a9e540d094)
    - use gist id: **33f60c724f51bde9afa2c2a9e540d094**
  - *dracula themes*
    - [gnome terminal](https://draculatheme.com/gnome-terminal)
    - [gtk](https://draculatheme.com/gtk)
    - [enable via shell-extensions](https://www.omgubuntu.co.uk/2020/04/enable-full-dark-mode-in-ubuntu-20-04)
    - [and do a quick backup](https://linuxconfig.org/ubuntu-20-04-system-backup-and-restore)
  - the browser based eslintrc in apps/client
  - the node based eslintrc in apps/pkgcheck
  - the root/rush.json config
  - most of the shit in root/common/config

</details>

## scripts and tasks
<details>
  <summary> info </summary>

  - `rushx about` see cur pkgs pkg.json scripts, or use with `rush-select` to see all scripts in all pkgs
</details>

<details>
  <summary> development </summary>

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
    - `rushx start:dev` useful in *apps/client* so devtools doenst open up
</details>

<details>
  <summary> testing and linting </summary>

  - `rushx test` inside an *{apps, libraries}/PKG* will run the test script for htat particular pkg
  - `rushx hint` requires chromium, setup for *apps/client*. saves report to *apps/client/hint-report/*
  - `rushx lighthouse` requires chromium. setupfor *apps/client*. saves report to *apps/client/doc/lighthouse*
  - `rushx browsertime` requires chromium, setup for *apps/client*, saves metrics to *apps/client/browsertime-results/*
  - `rushx flow:q` run flow quietly
  - `rushx eslint` run eslint
  - `rushx eslint:fix` run and fix eslint issues
</details>

<details>
  <summary> building </summary>

  - `rush build` in root; build all pkgs for development
  - `rushx select build:prod` in root; build all pkgs for production
  - `rushx build` in a pkg; build that pkg for development
  - `rushx build:prod` in a pkg; build that pkg for production
  - building *apps/client*
    - always saves bundle stats to *apps/client/bundlestats/*
</details>

<details>
  <summary> adding packages </summary>

  - `rush add -p PKGNAME --dev --exact -m`
    - add a pkg - you should be within a pkg and **not the root** dir
    - e.g. `cd apps/client && rush add -p webpack-bundle-analyzer packages/client --dev --exact -m`
      - will install webpack-bundle-analyzer into apps/client as a devDependency
  - to add a package from github
    - couldnt figure out how to do it via `rush add`
    - however this works if you edit the `package.json` directly
      - `"@reach/router": "https://github.com/noahehall/router",`
    - then run `rush update` to do the install
  - `rushx flowtyped:i` update flow type definitions for all deps using cache if available
  - `rushx flowtyped:i-force` install flow type definitions for all dpes
</details>

## environment
<details>
  <summary> variables </summary>

  - each *PKGDIR/pkg/package.json* should contain a `config` section with the default (and *public*) environment variables
    - *do not* create an `.env.example` - use the `PKGDIR/pkg/package.json.config` section
  - create a `PKGDIR/pkg/.env` file with environment variables you want to use in each microservice, referencing the name and values in the `PKGDIR/pkg/package.json.config`
    - to apply default values specified in `package.json.config` set the var name in the `.env` file to nothing, e.g. `API_HTTP_PORT=` and `@nodeproto/envproto.syncEnv` will update `process.env.API_HTTP_PORT` to the value specified in the `package.json.config`
      - if the the `.env` file has a value for the variable, it WILL NOT be updated!
        - this is so values set via CLI or `.env` take precedence over `package.json.config` values
</details>

<details>
  <summary> node options </summary>

    - checkout *root/package.json.config*
    - all of your *PKGDIR/pkg/.env* files should include this, but be sure to use **single** and **not double** quotes
</details>

<details>
  <summary> tls/ssl </summary>
  - self-signed certificates auto created on dev

</details>

## our favorite modules
  - got someting better?
  - please give us a link we love the latest and greatest and prefer the bleeding edge

<details>
  <summary> pkg management </summary>

  - [npm](https://www.npmjs.com/)
    - only used to install dry
  - [dry](https://github.com/Cosium/dry-dry/blob/master/src/index.test.ts)
    - never use `npm` within this applicatoin
    - always use `dry` instead which will proxy cmds to pnpm
  - [rush](https://rushjs.io/pages/commands)
    - [pnpm]([npmjs.com/](https://github.com/pnpm/pnpm))
    - all `rush` cmds use `pnpm`
  - [ultra-runner](https://github.com/folke/ultra-runner/blob/master/__tests__/runner.ts)
  - [yargs](https://github.com/yargs/yargs/blob/master/test/yargs.cjs)

</details>

<details>
  <summary> gateway </summary>

    - [haproxy](https://cbonte.github.io/haproxy-dconv/2.4/management.html)
</details>

<details>
  <summary> api </summary>

  - [koa](https://koajs.com/#introduction)
    - [koa-body](https://github.com/koajs/koa-body/blob/9b00b40adbfc40a5f5f73efbc88108adf66bcf8b/index.js#L75)
    - [koa-compose](https://github.com/koajs/compose/blob/25568a36509fefc58914bc2a7600f787b16aa0df/index.js#L19)
    - [koa-jwt](https://github.com/koajs/jwt#example)
    - [koa-session](https://github.com/koajs/session#example)
    - [koa-helmet](https://github.com/venables/koa-helmet)
    - [@koa/cors](https://github.com/koajs/cors)
    - [koa-ratelimit](https://github.com/koajs/ratelimit)
    - [koa-oas3](https://github.com/atlassian/koa-oas3)
</details>

<details>
  <summary> tls/ssl </summary>

  - [pem](https://github.com/Dexus/pem/blob/master/test/pem.spec.js)
</details>

<details>
  <summary> tooling </summary>

  - [esbuild for apis](https://esbuild.github.io)
    - [always review this first b4 intalling babel plugins](https://esbuild.github.io/content-types/#javascript)
  - [webpack 5 + esbuild for client](https://webpack.js.org/)
    - frontend requires complex bundling to support a wide range of environments.
    - thus we use both webpack 5 + esbuild
  - [es-main](https://github.com/tschaub/es-main/blob/main/test.js)
  - [concurrently](https://github.com/kimmobrunfeldt/concurrently)
</details>

<details>
  <summary> testing</summary>

  - [purple-tape](https://github.com/mattiash/purple-tape/blob/master/lib/test.ts)
  - [multi-tape](https://github.com/mattiash/node-multi-tape)
  - [sinon](https://sinonjs.org/)
  - [all non esbuild pkgs use flow (see todo)](https://flow.org/en/docs/)
  - [flow-type](https://github.com/flow-typed/flow-typed)
</details>

<details>
  <summary> linting </summary>

  - [webhint/hint](https://github.com/webhintio/hint)
  - [standard](https://standardjs.com/#table-of-contents)
  - [eslint](https://eslint.org/docs/user-guide/configuring/)
    - react as we need to support react linting
    - standard (minus comma-dangle) + react
  - [lighthouse](https://github.com/GoogleChrome/lighthouse#cli-options)
  - [browsertime](https://github.com/sitespeedio/browsertime)
    - [google admin toolbox has an excellent har analyzer](https://toolbox.googleapps.com/apps/har_analyzer/)
  - [bundle stats](https://github.com/relative-ci/bundle-stats/tree/master/packages/webpack-plugin)
</details>

<details>
  <summary> UI </summary>

  - [react](https://reactjs.org)
  - [react-icons](https://react-icons.github.io/react-icons/)
  - [clsx](https://github.com/lukeed/clsx)
  - [react-helmet](https://github.com/nfl/react-helmet)
  - [react-devtools](https://www.npmjs.com/package/react-devtools)]
</details>

<details>
  <summary> text/internationalization </summary>

  - [messageformat](https://github.com//messageformat)
</details>

<details>
  <summary> feature detection </summary>

  - [modernizr](https://modernizr.com/download?setclasses)
</details>

<details>
  <summary> css </summary>

  - [normalize.css](https://github.com/necolas/normalize.css/)
  - [milligram](https://milligram.io/)
  - [styled-components](https://styled-components.com/docs)
</details>

<details>
  <summary> animation </summary>

  - [animate.css](https://animate.style/)
</details>

<details>
  <summary> accessibility </summary>

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

</details>
