
</details>

<details>
  <summary>cmd reference</summary>

- any pkg.json.script prefixed `repo:` or `proto` should only be modified in `root/package.json` file and synced with child packages via `pnpm proto:script repo:jsync`
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
  ########### run within a single package
  # basic cmds (dont use with proto | proto:bin | proto:slice | etc)
  # remove the -r from a cmd to run in the current package only
  $ pnpm -r outdated # see all outdated packages
  $ pnpm -r upgrade -L # update all packages
    # ^ for packages with react, then do pnpm add react@next react-dom@next
  $ pnpm config list
  $ pnpm install # install deps of all packages (even root)
  $ pnpm repo:about # debug info
  $ pnpm repo:deps:graph # see mono repo dependency graph
  $ pnpm repo:eslint # see lint issues for current package
  $ pnpm repo:eslint:fix # fix lint issues in current package
  $ pnpm repo:monitor # top for @nodeproto
  $ pnpm repo:scripts # see current package script names
  $ pnpm repo:scripts:v # see current package script names + CMD each runs


  #########
  #########
  # useful if run with pnpm proto, e.g. pnpm proto repo:nuke
  $ pnpm repo:flowtyped:install # install flow-type defs
  $ pnpm repo:jsync # sync child package.json with root package.json
  $ pnpm repo:nuke # rm /dist & /node_modules directories
  $ pnpm repo:rm:dist # rm /dist dir
  $ pnpm repo:rm:nodemodules # remove /node_modules dir

  # useful if run with pnpm proto:script, e.g. pnpm proto:script build
  # ^ TODO: investigate why `pnpm proto` fails on these scripts
  $ pnpm proto:script build # build all packages
  $ pnpm proto:script repo:test # test all packages

  #### monorepo orchestration
  # TODO: how package.json script NAMES permit you to orchestrate tasks across subpackages
  $ pnpm proto start # localhost:7777, localhost:7777/v1
  $ pnpm proto start:client # localhost:7777, localhost:8080
  $ pnpm proto start:pkgcheck # localhost:7777/v1, localhost:3000/v1

  ##### other repo level cmds
  # TODO
  $ proto:slice
  $ pnpm proto:slice "packages/libraries/*" repo:test
  $ pnpm proto:slice "packages/apps/*" repo:test
```

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

- [recommended vs{codium,code-insiders,code} settings via sync settings extension](https://gist.github.com/noahehall/33f60c724f51bde9afa2c2a9e540d094)
  - use gist id: **33f60c724f51bde9afa2c2a9e540d094**
- *dracula themes*
  - [gnome terminal](https://draculatheme.com/gnome-terminal)
  - [gtk](https://draculatheme.com/gtk)
  - [enable via shell-extensions](https://www.omgubuntu.co.uk/2020/04/enable-full-dark-mode-in-ubuntu-20-04)
  - [and do a quick backup](https://linuxconfig.org/ubuntu-20-04-system-backup-and-restore)

</details>
