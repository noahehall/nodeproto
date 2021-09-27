# categorize these before deleting previous main branch `dev`

expect breaking changes until we release a version

![@nodeproto architecture](/doc/architecture.png)

scripts

- start from scratch (if getting pnpm|node errors)
  - [remove pnpm](https://pnpm.io/uninstall)
  - then fall through setup below

- setup `@nodeproto` for development
  - use pnpm to install node
    - install pnpm `curl -fsSL https://get.pnpm.io/install.sh | sh -`
    - install pnpm tab-completion `pnpm install-completion`
    - source your shell (e.g. bashrc `. ~/.bashrc`)
    - install node `pnpm env use --global 16`
      - FYI: as soon as 17 drops, we will be on it
  - ~~now that node is installed, use corepack to manage pnpm~~
    - ~~dont do this step until corepack is useable, or manageable via pnpm env (not sure which is the issue)~~
    - ~~install corepack `pnpm install -g corepack`~~
    - ~~update `packageManager` in `root/package.json` to the version of pnpm installed earlier~~
    - ~~manage pnpm via corepack `corepack enable`~~
    - ~~sync global version `corepack prepare pnpm@6.15.1 --activate`~~
  - setup application
    - install root dependencies `pnpm install`
    - install all monorepo packages dependencies `pnpm repo:install`
    - verify tests `pnpm exec ultra -r repo:test`
      - TODO: this currently fails but works if run from within each pkg
  - make any changes you want in `root/package.json` then sync them to monorepo packages
    - `pnpm repo:install && pnpm exec ultra -r jsync`

- idiosyncrasies (there like opinions, all frameworks have them)
  - `mjs` interopability with `cjs`
    - I could not find any solution (wtf node?) with a good developer experience, thus i settled on this custom approach based on nodejs docs
    - generally you need to enable `--experimental-specifier-resolution=node` to run `mjs` files as we dont specify an extension when importing anything
    - when we build for cjs
      - for libraries & tools
        - we use `swc` to compile source files to `dist/dir` in each package
        - we copy `commonjs.json` to `/dist/package.json` which sets `type="commonjs"`
        - swc will convert `mjs` files to `js` files in the `dist` dir
        - and sine we dont specify the extension in the mjs files, in addition to setting `type=commonjs` in the dist dir, everything works as expected whether in commonjs land or esm land
      - for node applications
        - TODO
      - for client applications
        - TODO

- [publishing a new version](https://pnpm.io/using-changesets)
  - create a new changeset `pnpm changeset`
  - version bump `pnpm changeset version`
  - update lockfile and rebuild pkgs `pnpm install`
  - commit changes
  - [should automate this via github action](https://pnpm.io/using-changesets#using-github-actions)

- publish packages `pnpm publish -r`
  - TODO

- upgrades
  - run `pnpm -r exec pnpm outdated` to see any outdated packages
    - we want to remain on the bleeding edge

- global cmds: can be run from anywhere within the monorepo
  - generally you want two terminals for the best experience
    - terminal 1: `pnpm repo:monitor`
    - terminal 2: see any of the cmds below
    - [always use pnpm exec with ultra](https://github.com/folke/ultra-runner#rocket-usage)
  - run cmd in specific pkg `pnpm proto @nodeproto/client start`
  - run cmd in specific pkg + dependencies `pnpm proto +@nodeproto/configproto repo"test`
    - note the `+` before the pkg name
    - dependencies: other monorepo pkgs, not node_modules
  - run cmd in all pkgs matching scope `pnpm proto "@nodeproto/*" repo:test`
    - will run all packages with scope @nodeproto
  - run cmd in all subdirectory `pnpm proto "packages/libraries/*" repo:test`
  - run cmd in all pkgs `pnpm exec ultra -r repo:test`
  - run specific package behind gateway
    - `pnpm exec ultra -r start:client` open browser to `localhost:7777`
      - TODO: client needs to wait for webpack to complete compiling or it throws abort error?
      - generally check `packages/apps/gateway/package.json` to see scripts
        - you want to add the start:PKG cmd in the gateway so ultra runs them both
  - run all packages behind gateway
    - `pnpm exec ultra -r start`
      - generall all pkgs should have a `start` script

- **TODO** default cmds available to all (appropriate) pkgs
  - test|test:ci|test:integration|test:e2e|test:ing (unit)|test:ing:e2e
    - ci - no concurrency (nothing should be concurrent in ci)
    - integration see @nodeproto/tests/integration
    - e2e see @nodeproto/tests/e2e
    - test:ing i.e. watch
  - build|build:prod
    - depending on the pkg, this could utilize swc, esbuild, or webpack (in increasing order of complexity, with decreasing order of build efficiency)
    - e.g. swc > esbuild > webpack build speed
    - but webpack > esbuild > swc in terms of managed complexity and flexibility
  - lint (should fix by defualt)
    - eslint
  - jsync
    - sync package/package.json with root/package.json
  - start:native:dev|start:native:prod|start:cloud:dev|start:cloud:prod
    - native - baremetal
    - cloud - docker
- cmds provided by ultra
  - `pnpm exec ultra --info` see package dependencies
  - `pnpm exec ultra --list` see package scripts
  - `pnpm exec ultra --monitor` monitor node processes in real time
    - i generally just keep this running in a second terminal
- easy to forget syntax of pnpm (TODO: move this to theBookOfNoah)
  - `pnpm add PKG`
    - @nodeproto/PKG add an internal pkg to another pkg
    - ./somedir/or/somefile.tar (a dir or file)
    - <git remote url>
      - latest commit from master `kevva/is-positive`
      - specific commit `kevva/is-positive#97edff6f525f192a3f83cea1944765f769ae2678`
      - specific branch `kevva/is-positive#master`
    - <https://github.com/indexzero/forever/tarball/v0.5.6>
    - -D dev deps
    - -O optional deps
    - -P dep (this is defualt)
    - --save-peer both dev and peer deps
    - --global (dont do it, just use pnpm exec)
  - [pnpm install](https://pnpm.io/cli/install)
  - pnpm -r exec pnpm up latest
    - upgrade all packages to their latest
      - fks up react alpha
  - [pnpm remove](https://pnpm.io/cli/remove)
  - [pnpm link](https://pnpm.io/cli/link)
  - [pnpm unlink](https://pnpm.io/cli/unlink)
  - [pnpm import](https://pnpm.io/cli/import)
    - useful when migrating from another pkg manager, e.g. yarn|npm
  - [pnpm fetch](https://pnpm.io/cli/fetch)
    - useful when building a docker image
  - [pnpm audit](https://pnpm.io/cli/audit)
  - [pnpm list](https://pnpm.io/cli/list)
  - [pnpm outdated](https://pnpm.io/cli/outdated)
  - [pnpm why](https://pnpm.io/cli/why)
  - [pnpm run](https://pnpm.io/cli/run)
    - doesnt run pre/post scripts, however ultra does
  - [pnpm publish](https://pnpm.io/cli/publish)
  - [pnpm pack](https://pnpm.io/cli/pack)
  - [pnpm recursive](https://pnpm.io/cli/recursive)
  - [pnpm server](https://pnpm.io/cli/server)
  - [pnpm store](https://pnpm.io/cli/store)

tests

- generally unit tests are located next to their source files
- integration & e2e tests are in `packages/tests`
  - check `packages/tests/integration` for runnable & reference implementations
  - TODO: e2e tests will be in `packages/tests/e2e`
- [uvu until we break it](https://github.com/lukeed/uvu)

other shit

- add the pnpm logo: <https://pnpm.io/logos>

- thoughts on micro frontends
  - if you're current dev experience is crap, i can totally see why you would go through the trouble of a single spa
  - if you're in a wonderfully designed monorepo, utilizing the latest version of git, with an awesome devops workflow, we'll keep the jokes between us

- thoughts on precommit hooks
  - prefer pre-merge|rebase hooks
    - <https://git-scm.com/docs/githooks#_pre_merge_commit>
    - <https://git-scm.com/docs/githooks#_pre_rebase>
  - i generally dislike anything that slows down development when another non-slow-me-down paradigm exists
    - i understand this is a losing battle, so likely i will implement a `pre-push` hook to meet the community halfway

- thoughts on meta, yarn, npm, pnpm: and why i chose pnpm and where ultra-runner + loop fits in
  - <https://pnpm.io/motivation>
  - <https://pnpm.io/cli/exec>
  - <https://pnpm.io/cli/dlx>
  - <https://pnpm.io/filtering>
  - <https://pnpm.io/cli/env>
  - <https://pnpm.io/package_json>
  - <https://pnpm.io/npmrc>
  - <https://pnpm.io/pnpm-workspace_yaml>
  - <https://pnpm.io/pnpmfile>
  - <https://pnpm.io/aliases>
  - <https://medium.com/pnpm/pnpm-vs-lerna-filtering-in-a-multi-package-repository-1f68bc644d6a>
  - we actually dont need ultra runner, you can run all cmds above via `pnpm -r CMD` + filtering, parallelism, etc.
    - however: have you seen the heavenly output of ultra-runner?
  - we actually dont need loop, however... **TODO**

- thoughts on cloud native
  - definitely the way to go.... after everything works on baremetal
  - im 100% for virtualization, but baremetal is still best for debugging

- [npmrc pnpm specific](https://pnpm.io/npmrc)
- [update pnpm publishConfig before publishing](https://pnpm.io/package_json)
- [use this link to add to our readmefile for pnpm](https://pnpm.io/installation)
- [migrating from typescript to flow](https://github.com/niieani/typescript-vs-flowtype)
- [finish setting up github packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [finish setting up gitub container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [finish setting up snyk](https://app.snyk.io/org/noahehall/manage/integrations/github)
- [finish setting up codeql](https://codeql.github.com/docs/codeql-for-visual-studio-code/)
- [finish settin gup gitpod](https://gitpod.io/workspaces/)
- [finish setting up security workflows](https://github.com/noahehall/nodeproto/actions)
- [finish setting up github beta release projects](https://github.com/noahehall/nodeproto/projects/1?add_cards_query=is%3Aopen)

# support us

- [buy me a starbook](https://us.starlabs.systems/)

# @nodeproto

- bleeding-edge monorepo for rapidly prototyping end-to-end, complex, and secure applications and microservices

| tech stach |
| :----------: |
| <img src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" width="100" align="left" /><img src="https://www.openapis.org/wp-content/uploads/sites/3/2018/02/OpenAPI_Logo_Pantone-1.png" width="100" align="left" /><img src="https://cdn.haproxy.com/wp-content/uploads/2017/10/haproxy-weblogo.png" width="100" align="left" /><img src="https://nodejs.org/static/images/logo.svg" width="100" align="left" /><img src="https://github.com/evanw/esbuild/raw/master/images/wordmark.svg" width="100" align="left" /><img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="100" align="left" /><img src="https://hero35.com/stacks/react.svg" width="100" align="left" /><img src="https://raw.githubusercontent.com/koajs/koa/master/docs/logo.png" width="100" align="left" /><img src="https://user-images.githubusercontent.com/645641/79596653-38f81200-80e1-11ea-98cd-1c6a3bb5de51.png" width="100" align="left" /><img src="https://cdn.rawgit.com/standard/standard/master/badge.svg" width="100" align="left" /><img src="https://camo.githubusercontent.com/32657601b349b558831f32c553cb2c7734cb5ae89a2e8340afa314ea3b2116a0/68747470733a2f2f6d696c6c696772616d2e696f2f696d616765732f7468756d626e61696c2e706e67" width="100" align="left" />|

## getting started

<details>
  <summary> installation and starting </summary>
  - TODO: all of this is obsolete
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
