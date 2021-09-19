import esbuild from 'esbuild';

// TODO: these module globals restricts us to running 1 server at a time
// for auto starting in dev
let servers, manifest, manifestUri, appInputFilename;

const stopDev = async () => servers?.length && servers.forEach(s => s.close());

const startDev = async results => {
  console.info('\n\n wtf is results', results);

  // @see https://github.com/noahehall/nodeproto/blob/dev/apps/pkgcheck/lib/esbuild.config.mjs
  // return fsproto.fs.readFile(manifestUri, 'utf-8')
  //   .then(manifest => import('../' + JSON.parse(manifest)[appInputFilename]))
  //   .then(async newServers => {
  //     if (newServers) servers = await newServers.runApp();

  //     return servers;
  //   });
};

const logResults = async ({ errors = [], warnings = [], results }) => {
  await stopDev();
  if (warnings.length) console.info('\n\n build warnings', warnings);
  if (errors.length) throw new Error(errors);

  console.info('\n\n finished build\n', Object.keys(results.metafile.outputs));
}

export const esrunConfig = async config => {
  const newConfig = {
    ...config,
    watch: {
      async onRebuild(errors, results) {
        await logResults({ errors, results});
        await startDev(results);
      }
    },
  };

  const { errors, warnings, ...results } = await esbuild.build(newConfig);

  await logResults({ errors, warnings, results });
  await startDev(results);
}

export const esbuildConfig = async config =>
  esbuild.build(config).then(results => {
    logResults(results);
  });
