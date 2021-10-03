import esbuild from 'esbuild';
import { fsproto } from '@nodeproto/wtf/fsproto';

const servers = new Map();

export const stopDev = async config => {
  const app = servers.get(config.entryPoints);

  if (!app) return;

  const { httpTerminator, server, controller } = app;

  if (httpTerminator) await httpTerminator.terminate();
  else if (controller) await controller.abort();
  else if (server) await server.close();
  else throw new Error('retrieved app doenst contain httpTerminator|server|controller properties');
};

const startDev = async config => {
  await stopDev(config);

  let manifest, server;

  try {
    // will break if consumer uses a different manifest name
    manifest = JSON.parse(await fsproto.fs.readFile(config.outdir + '/' + 'manifest.json', 'utf-8'));

    // will likely break if consumer has multiple entyrpoints and hte first isnt the server
    const serverPath = config.outdir + '/' + Object.values(manifest)[0].split('/').pop();

    server = await import(serverPath);

    if (!server.runApp) throw new Error('server does not contain runApp fn');

    servers.set(config.entryPoints, await server.runApp());

    return servers;
  } catch (e) {
    console.error('\n\n error starting server', config, manifest, servers);

    throw new Error(e);
  }
};

const logResults = ({ errors = [], warnings = [], metafile }) => {
  if (warnings.length) console.warn('\n\n build warnings', warnings);
  if (errors.length) throw new Error(errors);

  console.info('\n\n finished build\n', Object.keys(metafile.outputs));

  return true;
};

export const esbuildConfig = async config =>
  esbuild.build(config).then(results => (logResults(results), results));

export const esrunConfig = async conf => {
  const config = {
    ...conf,
    watch: {
      async onRebuild(errors, results) {
        if (errors) throw new Error(errors);

        logResults(results);

        await startDev(conf);
      }
    },
  };

  await esbuildConfig(config);
  await startDev(config);
};
