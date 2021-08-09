# @nodeproto/configproto - flowtype config

- flow > typescript

- recommendations
  - dont use a flowconfig if you already use eslint
    - [use eslint-plugin-flowtype-errors isntead](https://github.com/amilajack/eslint-plugin-flowtype-errors/wiki/Getting-Started)
    - [use eslint-plugin-flowtype instead](https://github.com/gajus/eslint-plugin-flowtype)
      - this is also used by babel internally
    - both of the above eslint plugins enable flowtype with 0 changes to your setup
