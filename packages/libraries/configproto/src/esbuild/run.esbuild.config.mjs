import esbuild from 'esbuild';


// for auto starting in dev
let servers = undefined;
export const stopDev = async () => isDev && servers?.length && servers.forEach(s => s.close());

export const startDev = async () => {
  if (isBuild) return;

  await (stopDev());

  return fsproto.fs.readFile(manifestUri, 'utf-8')
    .then(manifest => import('../' + JSON.parse(manifest)[appInputFilename]))
    .then(async newServers => {
      if (newServers) servers = await newServers.runApp();

      return servers;
    });
};

// TODO
export const esrunConfig = async config => {
  const newConfig = {
    ...config,
    watch: {
      async onRebuild(error, result) {
        buildAndRun({ bff, ...result });

        if (error) console.error(error);
      }
    },
  };


  // TODO: all about auto starting an http based node app
  /*
    ({  errors, warnings, ...result }) => {

    console.info('\n\n finished build\n', Object.keys(result.metafile.outputs));

    if (errors.length || warnings.length)
      console.warn('\n\n build notifications', { errors, warnings });

    if (bff) startDev();
    else result.stop();
  };
  */
}

export const esbuildConfig = async config =>
  esbuild.build(config).then(result => {
    console.info('\n\n done', result);
  });
