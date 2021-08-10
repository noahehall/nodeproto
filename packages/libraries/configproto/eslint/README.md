# @nodeproto/configproto - eslint configs

- eslint doesnt support `.mjs`
- all files available as as `yml` files
  - i need to keep my yaml sharp anyway

# links

- [check our node notes for configuration help](https://www.github.com/noahehall/theBookOfNoah/blob/master/0current/node.md)

# TLDR

- extending a config (use the full path)
  - `extends: './node_modules/@nodeproto/configproto/eslint/base.eslintrc.yml'`
- linting all subdirectories via pkg.json script
  - our configs ignore node_modules & dist dirs by default
  - `eslint": "eslint './**/*'",`

# known issues

- [you need a babelrc to use toplevel await](https://github.com/babel/babel/discussions/12685)
  - still figuring this out for vscode, but atleast the eslint script runs now
