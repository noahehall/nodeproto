# @nodeproto

bleeding-edge type-first *product development framework* for rapidly prototyping end-to-end, complex, and secure products within a baremetal|cloud-native micro-service architecture

- tests
  - [@nodeproto/tests - Integration + e2e tests for everything below](tests/README.md)
- services (examples)
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
  - [@nodeproto/membrane - virutalization via docker +/ vagrant](packages/tools/membrane/README.md)

|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          tech stack                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img src="https://webpack.js.org/site-logo.1fcab817090e78435061.svg" width="100" align="left" /><img src="https://www.openapis.org/wp-content/uploads/sites/3/2018/02/OpenAPI_Logo_Pantone-1.png" width="100" align="left" /><img src="https://cdn.haproxy.com/wp-content/uploads/2017/10/haproxy-weblogo.png" width="100" align="left" /><img src="https://nodejs.org/static/images/logo.svg" width="100" align="left" /><img src="https://github.com/evanw/esbuild/raw/master/images/wordmark.svg" width="100" align="left" /><img src="https://avatars.githubusercontent.com/u/5429470?s=200&v=4" width="100" align="left" /><img src="https://hero35.com/stacks/react.svg" width="100" align="left" /><img src="https://raw.githubusercontent.com/koajs/koa/master/docs/logo.png" width="100" align="left" /><img src="https://camo.githubusercontent.com/32657601b349b558831f32c553cb2c7734cb5ae89a2e8340afa314ea3b2116a0/68747470733a2f2f6d696c6c696772616d2e696f2f696d616765732f7468756d626e61696c2e706e67" width="100" align="left" /><img src="https://raw.githubusercontent.com/emotion-js/emotion/main/emotion.png" alt="Emotion logo" width="100"><img src="https://github.com/lukeed/uvu/blob/ddf62e883b5e56c3ba84ad0acf0e7966cc3ade48/shots/uvu.jpg" alt="UVU logo" width="100"><img src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/vagrant/vagrant.png" alt="vagrant logo" width="100"> |

<details>
  <summary>Learn more about @nodeproto</summary>

- for understanding why @nodeproto exists
  - my desire is to blend devops, backend, and frontend work into a single Product Development framework... haha yea, good luck right?
    - [similar to what these guys were thinking](https://lipas.uwasa.fi/~phelo/papers/Collaborative%20customized%20product%20development%20framework_IMDS_2009.pdf)
  - whats a product development framework ?
    - consider what a web framework, or an application framework is
    - then consider everything else you would need

- [review our contributing docs](https://github.com/noahehall/nodeproto/blob/develop/CONTRIBUTING.md)

- for contributing:
  - you should be:
    - intermediate/advanced with docker, node, shell scripting, cloud (aws specifically), [flowtype](https://github.com/facebook/flow/blob/main/lib/react.js) and especially javascript
    - capable of learning other vertical technologies used by this framework (but if your good at the other stuff, piece of cake)

- for consuming:
  - you should be good at javascript

</details>
<br/>

## TLDR

|                   architecture                    |
| :-----------------------------------------------: |
| ![@nodeproto architecture](/doc/architecture.png) |

under activate development; expect breaking changes

<details>
  <summary>cmd reference</summary>

- any pkg.json.script prefixed `repo:` or `proto` should only be modified in `root/package.json` file and synced with child packages via `pnpm proto repo:jsync`
  - except `shared|configproto|testproto` as these are dependencies of `jsync`
    - TODO: ^ automate that

```sh
  ########## ABOUT MONOREPO CMDS ##############
  # run cmds from root|any child directory within monorepo
  # $ pnpm proto CMD_LIST
  # ^ runs CMD_LIST in all packages; CMD_LIST is used wherever its found first across packages
  # ^^ package.json.script[CMD] > pkg/bin > pkg/node_modules/.bin > system path
  # ^^ if cmd is not found in ANY pkg, will error
  # e.g. below
  $ pnpm proto pwd # prints absolute path of each package via ultra
  $ pnpm proto repo:about # prints debug info for each package
  $ pnpm proto this:doesnt:exist # prints error as the cmd was not found in ANY packages

  # $ pnpm proto:script CMD_LIST
  # ^ same as above, but only looks in pkg.json.script
  # ^ i see this work better for cmds that modify pnpm cache, or if ultra-runner fails for some reason
  # e.g. below
  $ pnpm proto:script repo:flowtyped:install # runs package.json.script in all packages where its found

  # $ pnpm proto:bin CMD_LIST
  # ^ same as above, but only executes cmds found in the system PATH
  $ pnpm proto:bin pwd # prints the absolute path of each subpackage

  ############ CMDS YOU COULD BUT SHOULDNT ##########
  $ pnpm exec flow # generally you should run flow via eslint
  $ pnpm exec flow status|etc # generally you should run flow via eslint

  ############ AVAILABLE CMDS ##############
  ########### run within a single package/root
  # basic cmds (dont use with proto | proto:bin | proto:slice | etc)
  # remove the -r from a cmd to run in the current package only
  $ pnpm -r outdated # see all outdated packages
  $ pnpm -r upgrade -L # update all packages
  $ pnpm config list
  $ pnpm install # install deps of all packages (even root)
  $ pnpm repo:about # debug info
  $ pnpm repo:deps # see mono repo dependency graph
  $ pnpm repo:eslint # see lint issues for current package
  $ pnpm repo:eslint:fix # fix lint issues in current package
  $ pnpm repo:monitor # top for @nodeproto
  $ pnpm repo:scripts # see current package script names
  $ pnpm repo:scripts:v # see current package script names + CMD each runs


  #########
  # should only be run by your build script
  $ pnpm repo:cp:cjs # copy configproto/package.json into package/dist/package.json
  # ^ for setting the dist to commonjs
  $ pnpm repo:cp:configproto # copy configproto/[flow,cjs,browserslist] into package

  #########
  # useful if run with pnpm proto
  $ pnpm repo:cp:browserslist # copy configproto/browserslistrc into package
  $ pnpm repo:cp:flow # copy configproto/.flowconfig into package
  $ pnpm repo:flowtyped:install # install flow-type defs
  $ pnpm repo:jsync # sync child package.json with root package.json
  $ pnpm repo:nuke # rm /dist & /node_modules directories
  $ pnpm repo:rm:dist # rm /dist dir
  $ pnpm repo:rm:nodemodules # remove /node_modules dir

  # useful if run with pnpm proto:script
  # ^ TODO: investigate why `pnpm proto` fails on these scripts
  $ pnpm proto:script build # build all packages
  $ pnpm proto:script repo:test # test all packages

  #### monorepo orchestration
  # TODO: how package.json script NAMES permit you to orchestrate tasks across subpackages
  $ pnpm proto start # localhost:7777, localhost:8081, https:localhost:8443
  $ pnpm proto start:client # localhost:7777
  $ pnpm proto start:dev # localhost:8080

  ##### other repo level cmds
  # TODO
  $ proto:slice
  $ pnpm proto:slice "packages/libraries/*" repo:test
  $ pnpm proto:slice "packages/apps/*" repo:test
```

</details>

## getting started

<details>
  <summary>contributing</summary>

### installation

- baremental
  - TODO
  - use pnpm to install node
    - install pnpm `curl -fsSL https://get.pnpm.io/install.sh | sh -`
    - install node `pnpm env use --global 16`
    - install pnpm tab-completion `pnpm install-completion`
    - source your shell (e.g. bashrc `. ~/.bashrc`)

- vagrant + vb
  - TODO
  - ensure vagrant 2.2.18 & vb 6.1 installed
  - `vagrant up`
  - `vagrant ssh`
  - `cd /opt/nodeproto`
  - `pnpm install`
  - `pnpm proto:script build`
  - `pnpm proto:script repo:test`

### setup @nodeproto development environment

- install root + subpackage dependencies `pnpm install`
- build dependences for all packages/* `pnpm proto:script build`
- run all tests in all packages `pnpm proto:script repo:test`
- make any changes you want in `root/package.json` then sync them to sub modules
  - `pnpm proto repo:jsync`

- flowtyped
  - TODO
  - `pnpm add --global flow-typed`
    - TODO: i think i actually installed this as a local dep (which is what you should do anyway)
  - run `pnpm proto repo:flow-typed:install` in all of your child pkgs to get type definition
  - run `pnpm exec flow` to get near realtime type checking for transpiled files
  - use the experimental loader in  `packages/configproto/src/node/loaders/flow.mjs` for non transpiled files

- haproxy
  - until we get docker setup make sure you have **haproxy 2.4** installed
  - see *apps/gateway* for instructions

- monorepo build process: a 3 step process (plans for automation later)
  1. sync with root `$ pnpm proto jsync`
  2. copy static files `$ pnpm proto repo:cp:configproto`
  3. build output files to dist `$ pnpm proto build`
     - if there havent been any changes, you likely only need this last step

</details>

<details>
  <summary> gotchas </summary>

- idiosyncrasies (there like opinions, all frameworks have them)
- where appropriate, [we follow the linux filesystem hierarchy](https://help.ubuntu.com/community/LinuxFilesystemTreeOverview#Main_directories)
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
