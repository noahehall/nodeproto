# @nodeproto/configproto - flowtype config

- flow > typescript
  - flow integrates into your workflow,
  - typescript cannabolizes your workflow
  - keep the `.flowconfig` in the root dir as we are unable to extend

- recommendations
  - [eslit-plugin-flowtype-errors](https://github.com/amilajack/eslint-plugin-flowtype-errors/wiki/Getting-Started)
    - works perfectly
    - follow the get starting guide and it just works
      - can also check our @nodeproto/tests for integration reference
      - be sure your `.flowconfig.version` matches your `devDeps { flow-bin: version}`
        - ensure the errors flow-bin reports matches the errors reported in your eslint
    - you can add this `pkg.json.script` to automatically use our `.flowconfig`
      - `"postinstall": "cp node_modules/@nodeproto/configproto/.flowconfig .",`
      - or check how they do it here: `eslint-plugin-flowtype-errors/dist/index.js`
