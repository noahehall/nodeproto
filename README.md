# @nodeproto

- bleeding-edge type-first *product development framework* for rapidly prototyping end-to-end, complex, and secure products within a baremetal|cloud-native micro-service architecture

- for understanding why @nodeproto exists
  - [review our contributing docs](https://github.com/noahehall/nodeproto/blob/develop/CONTRIBUTING.md)

- for contributing:
  - you should be:
    - intermediate/advanced with docker, node, shell scripting, cloud (aws specifically), [flowtype](https://github.com/facebook/flow/blob/main/lib/react.js) and especially javascript
    - capable of learning other vertical technologies used by this framework (but if your good at the other stuff, piece of cake)

- for consuming:
  - you should be good at javascript

- whats a product development framework ?
  - well first think whats a web framework, or an application framework
  - then think of everything else you would need when you're done using those

![@nodeproto architecture](/doc/architecture.png)

## TLDR

under activate development; expect breaking changes

be sure to checkout `root/tests/integration` for how to use our internal magic

```sh
  # top for nodeproto
  $ pnpm repo:monitor

  # pnpm proto ...
  # ^ execute cmd|bin in ALL/SOME pkgs from ANYWHERE in monorepo

  # ^ runs SOMECMD in all workspace packages
  $ pnpm proto pnpm outdated
  $ pnpm proto pnpm install

  # ^ runs script in all workspace packages that have the script
  $ pnpm proto jsync
  $ pnpm proto build
  $ pnpm proto repo:cp:configproto
  $ pnpm proto repo:test
  $ pnpm proto repo:eslint
  $ pnpm proto repo:eslint:fix # eslint + flowtype-errors eslint plugin
  $ pnpm proto start:client # localhost:7777
  $ pnpm proto start:dev # localhost:8080
  $ pnpm proto start
  $ pnpm proto webext:run # @nodeproto/bodyguard
  $ pnpm proto repo:config:list # pnpm configuration (super handy)
  $ pnpm proto repo:exec:list # all pkgjson scripts

  # pnpm proto:slice ... ...
  # ^ runs cmd|bin in all packages/** directories matching filter from ANYWHERE in monorepo
  $ pnpm proto:slice "packages/libraries/*" repo:test
  $ pnpm proto:slice "packages/libraries/*" repo:test

  # pnpm CMD/BIN
  # pnpm exec CMD/BIN
  # ^ recommended to use exec when running ./node_modules/.bin/CMDs
  # ^^ in the event there is a matching package.json SCRIPT with the same .bin/CMD name
  # ^^ without exec pnpm will choose pkgjson.script.NAME > ./node_modules/.bin/NAME
  # ^ execute a package.json.script:CMD |./node_modules/.bin/CMD in the current directory
  pnpm repo:test
  pnpm exec flow status

```

## framework components

anything listed below should be ready for dev, but not primetime (wait for alpha release)

- tests
  - [@nodeproto/tests - Integration + e2e tests for everything below](tests/README.md)
- services
  - [@nodeproto/gateway - HAproxy Gateway](packages/apps/gateway/README.md)
  - [@nodeproto/client - React@alpha frontend](packages/apps/client/README.md)
  - [@nodeproto/pkgcheck - Koa/OpenAPI@3 backend](packages/apps/pkgcheck/README.md)
- libraries
  - [@nodeproto/configproto - Static configurations](packages/libraries/configproto/README.md)
  - [@nodeproto/shared - utility fns](packages/libraries/shared/README.md)
  - [@nodeproto/testproto - High Velocity test suite](packages/libraries/testproto/README.md)
  - [@nodeproto/envproto - env/SSL management](packages/libraries/envproto/README.md)
  - [@nodeproto/buildproto - esbuild/webpack: build anything run everywhere](packages/libraries/buildproto/README.md)
  - [@nodeproto/wtf - Where the file? system locations & file management](packages/libraries/wtf/README.md)
- tools
  - [@nodeproto/jsync - synchronize package.json[c] files](packages/tools/jsync/README.md)
  - [@nodeproto/bodyguard - UI Network Request proxy + debugger](packages/tools/bodyguard/README.md)

## getting started

<details>
  <summary>contributing</summary>

- use pnpm to install node
  - install pnpm `curl -fsSL https://get.pnpm.io/install.sh | sh -`
  - install pnpm tab-completion `pnpm install-completion`
  - source your shell (e.g. bashrc `. ~/.bashrc`)
  - install node `pnpm env use --global 16`
- setup application
  - install root dependencies `pnpm install`
  - install dependencies for all packages/* `pnpm repo:install`
  - ~~run all tests in all packages `pnpm repo:test`~~
    - TODO: this currently fails but works if run from within each pkg
  - make any changes you want in `root/package.json` then sync them to monorepo packages
    - `pnpm proto jsync`
- flowtyped
  - `pnpm add --global flow-typed`
  - run `flow-typed install` in all of your child pkgs to get type definition
  - run `pnpm exec flow` to get near realtime type checking for transpiled files
  - use the experimental loader in  `root/src/loaders/flow.mjs` for non transpiled files
- haproxy
  - until we get docker setup make sure you have **haproxy 2.4** installed
  - see *apps/gateway* for instructions
- library build process: a 3 step process (plans to for automation later)
  1. sync with root `$ pnpm jsync`
  2. copy static files `$ pnpm repo:cp:configproto`
  3. build output files to dist `$ pnpm build`
     - if there havent been any changes, you likely only need this last step

</details>

<details>
  <summary> gotchas </summary>

- idiosyncrasies (there like opinions, all frameworks have them)
- `mjs` interoperability with `cjs`
  - I could not find any solution (wtf node?) with a good developer experience, thus i settled on this custom approach based on nodejs docs
  - generally you need to enable `--experimental-specifier-resolution=node` to run `mjs` files as we dont specify an extension when importing anything
  - when we build for cjs
    - for libraries & tools
      - we use `swc` to compile source files to `dist/dir` in each package
      - we copy `configproto/src/commonjs.json` to `/dist/package.json` which sets `type="commonjs"`
      - swc will convert `mjs` files to `js` files in the `dist` dir
      - and sine we dont specify the extension in the mjs files, in addition to setting `type=commonjs` in the dist dir, everything works as expected whether in commonjs land or esm land

</details>

## important files and locations

<details>
  <summary> directories </summary>

- *root/packages/apps* main applications
- *root/packages/libraries* libraries used by applications
- *root/packages/tools*
- *root/doc* various docuemntation
- *root/tests* monorepo integration & e2e tests

</details>

<details>
  <summary> dotfiles </summary>

- [editorconfig](https://editorconfig.org/)
- [gitignore](https://git-scm.com/docs/gitignore)
- [gitattributes](https://git-scm.com/docs/gitattributes)
- [npmrc](https://docs.npmjs.com/cli/v7/configuring-npm/npmrc)
- [hintrc](https://github.com/webhintio/hint/blob/main/packages/hint/docs/user-guide/configuring-webhint/summary.md)
- [eslintrc](https://eslint.org/docs/user-guide)
- [flowconfig](https://flow.org/en/docs/config/)

</details>

<details>
  <summary> configuration </summary>

- [recommended vscodium settings via sync settings extension](https://gist.github.com/noahehall/33f60c724f51bde9afa2c2a9e540d094)
  - use gist id: **33f60c724f51bde9afa2c2a9e540d094**
- *dracula themes*
  - [gnome terminal](https://draculatheme.com/gnome-terminal)
  - [gtk](https://draculatheme.com/gtk)
  - [enable via shell-extensions](https://www.omgubuntu.co.uk/2020/04/enable-full-dark-mode-in-ubuntu-20-04)
  - [and do a quick backup](https://linuxconfig.org/ubuntu-20-04-system-backup-and-restore)

</details>

## scripts and tasks

<details>
  <summary> info </summary>

- todo

</details>

<details>
  <summary> development </summary>

- dev scripts: open browser to **localhost:7777**
- **NOTE** all START scripts use **haproxy**
  - we dont drop priviledges in *DEV*, if you want, do the below
    - [to *START* as root, but dont *RUN* as root when using **packages/gateway**: click here to read why haproxy recommends this](https://cbonte.github.io/haproxy-dconv/2.4/management.html#13)

</details>

<details>
  <summary> testing and linting </summary>

- todo

</details>

<details>
  <summary> building </summary>

- todo

</details>

<details>
  <summary> adding packages </summary>

- todo

</details>

## environment

<details>
  <summary> variables </summary>

- todo

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

- [ultra-runner](https://github.com/folke/ultra-runner/blob/master/__tests__/runner.ts)
- [pnpm](https://pnpm.io/cli/install)

</details>

<details>
  <summary> gateway </summary>

- [haproxy](https://cbonte.github.io/haproxy-dconv/2.4/management.html)

</details>

<details>
  <summary> api </summary>

- [koa](https://koajs.com/#introduction)

</details>

<details>
  <summary> tls/ssl </summary>

- [local ssl: pem](https://github.com/Dexus/pem/blob/master/test/pem.spec.js)

</details>

<details>
  <summary> tooling </summary>

</details>

<details>
  <summary> testing</summary>

- [uvu](https://github.com/lukeed/uvu)

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

</details>
