
// import path && fs for use in setup

/**
 * namespace: containers for virtual modules that dont correspond to physical files
 * filters: every callback requires a filter to remove files that dont match the appropriate path
 * general notes:
 * + return undefined to let other callbacks process the THING
 * + all callback options include { filter, namespace }
 * + always cache the results of your plugin, building is the main bottleneck (not bundling)
 * setup: useful for initialation logic
 * + you also place the lifecycle method handlers here
 * + useful for: only place to modify the build options, and are then unmodifiable once this returns
 * ++ all builds after one reuse the same build options
 * ++ incremental rebuilds, watch mode, and serve mode do not update their build options after the first build
 * onResolve: run on each import path to customize path resolution, e.g. load a different path
 * + return undefined to ignore a file
 * onLoad: run for each unique path/namespace pair that has not been marked as external
 * + loads the contents of the module and instructs esbuild to interpret
 * onStart: trigger before initial + rebuild
 * + if you return a promise, lifecycle methods do not wait for it to be resolve (be CAREFUL)
 * + useful for incremental builds, watch mode, and the serve api
 * + not useful for initialization (use the body of the setup function instead)
 * onEnd: called when a new build ends (for all build)
 * + all onEnd callbacks are run in serial and each has access to the final build result
 * ++ can modify the build result or return a promise to delay the end of the build
 * ++ inspect the build graph by enabling the metafile setting
 * + useful for: incremental builds, watch mode and serve api
 * example plugins:
 * + http plugin: https://esbuild.github.io/plugins/#http-plugin
 * + webassembly plugin: https://esbuild.github.io/plugins/#webassembly-plugin
 * + svelte plugin: https://esbuild.github.io/plugins/#svelte-plugin
 */

// cache mapping { filepath: { input, output} }
// for us to return the previous output if the input hasnt change
// ALWAYS use the filepath as key
// @see https://esbuild.github.io/plugins/#caching-your-plugin
const cache = new Map();

const name = PLUGIN_NAME;

export const PLUGIN_NAME = {
  name,
  setup (build) {
    // inspect and modify build options
    // const options = build.initialOptions;
    // options.define = options.define ?? {};
    // options.define['process.env.POOP'] = '"is a #2"';
    const { options } = build.initialOptions[name] ?? {};
    if (!options) return;

    // initialization code
    // use the body of the setup fn
    // code here runs ONCE

    // @see https://esbuild.github.io/plugins/#resolve-arguments
    build.onResolve(
      { filter: REGEX, namespace: poop },
      async args => {
        // dynamic path resolution
        // for any files in any asset dirs
      }
    );

    // @see https://esbuild.github.io/plugins/#load-callbacks
    build.onLoad(
      { filter: REGEX },
      // @see https://esbuild.github.io/plugins/#load-arguments
      async args =>
      // business logic

        // @see https://esbuild.github.io/plugins/#load-results
        ({ contents: FILE_CONTENTS, loader: 'json|js|etc' })

    );

    // @see https://esbuild.github.io/plugins/#start-callbacks
    build.onStart(() => {
      console.log('\n\n build started');
    });

    // @see https://esbuild.github.io/plugins/#end-callbacks
    build.onEnd(result => {

    });
  },
};
