

// @see https://github.com/folke/ultra-runner/blob/master/__tests__/runner.ts
// @see https://github.com/folke/ultra-runner/blob/master/src/options.ts
(new (require('ultra-runner').Runner)()).run(
  require('yargs')(require('yargs/helpers').hideBin(process.argv)).argv._[0],
  require('../package.json'));

/**
  ultra contract
 {
    │   ChangeType: [Getter],
    │   needsBuild: [Getter],
    │   NoGitError: [Getter],
    │   parseFiles: [Getter],
    │   getGitFiles: [Getter],
    │   cache: [Getter],
    │   findPackages: [Getter],
    │   findUp: [Getter],
    │   getPackage: [Getter],
    │   Runner: [Getter],
    │   Workspace: [Getter],
    │   getWorkspace: [Getter],
    │   WorkspaceProviderType: [Getter],
    │   providers: [Getter]
    │ }
 */
