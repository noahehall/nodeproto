import esbuild from 'esbuild';


// for auto starting in dev
let servers = undefined;
export const stopDev = async () => servers?.length && servers.forEach(s => s.close());

const startDev = async results => {
  console.info('\n\n wtf is results', results);

  // return fsproto.fs.readFile(manifestUri, 'utf-8')
  //   .then(manifest => import('../' + JSON.parse(manifest)[appInputFilename]))
  //   .then(async newServers => {
  //     if (newServers) servers = await newServers.runApp();

  //     return servers;
  //   });
};

const logResults = async ({ errors, warnings, results }) => {
  if (errors.length || warnings.length) {
    await stopDev();
    throw new Error({ errors, warnings });
  }
  else
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

  const ({ errors, warnings, ...results }) = await esbuild.build(config);

  await logResults({ errors, warnings, results });
  await startDev(results);
}

export const esbuildConfig = async config =>
  esbuild.build(config).then(results => {
    logResults(results);
  });
