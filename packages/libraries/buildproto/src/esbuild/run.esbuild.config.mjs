// @flow

import { fsproto } from '@nodeproto/wtf';
import { throwIt } from '@nodeproto/shared';
import esbuild from 'esbuild';

import type {
  EsbuildConfigType,
  EsbuildResultsType,
  NodeprotoEsbuildServerInstanceType,
  NodeprotoEsbuildServerTrackerType,
  NodeprotoEsbuildServerType,
  ObjectType,
} from '../../libdefs';

const servers: NodeprotoEsbuildServerTrackerType = new Map();

export const stopDev = async (config: EsbuildConfigType): Promise<void> => {
  const runningServer: NodeprotoEsbuildServerInstanceType | void = servers.get(config.entryPoints);

  if (!runningServer) return void 0;

  const { httpTerminator, server, controller } = runningServer;

  if (httpTerminator) await httpTerminator.terminate();
  else if (controller) await controller.abort();
  else if (server) await server.close();
  else throwIt('retrieved app doesnt contain httpTerminator|server|controller properties');
};

export const startDev = async (
  config: EsbuildConfigType
): Promise<typeof servers | void> => {
  await stopDev(config);

  let
    manifest: ObjectType,
    server: NodeprotoEsbuildServerType | void,
    serverPath: string
  ;

  try {
    // TODO: will break if consumer uses a different manifest name
    manifest = JSON.parse(
      await fsproto.fs.readFile(config.outdir + '/' + 'manifest.json', 'utf-8')
    );

    // TODO: will likely break if consumer has multiple entyrpoints and hte first isnt the server
    if (!manifest) throwIt('esbuild manifest not found');

    const foundServerPath = Object.values(manifest)[0];
    if (typeof foundServerPath !== 'string') throwIt('esbuild server path not found');
    else {
      serverPath = config.outdir + '/' + foundServerPath.split('/').pop();
    }

    try {
      server = await import(serverPath); // eslint-disable-line
    } catch (e) {
      console.error('\n\n error importing serverPath', serverPath);

      throwIt(e);
    }

    if (!server?.runApp) throwIt('server does not contain runApp fn');
    else servers.set(config.entryPoints, await server.runApp());

    return servers;
  } catch (e) {
    console.error('\n\n error starting server', config, manifest, servers);

    throwIt(e);
  }
};

export const logResults = ({
  errors = [],
  warnings = [],
  metafile
}: EsbuildResultsType ): boolean | void => {
  if (warnings.length) console.warn('\n\n build warnings', warnings);
  if (errors.length) throwIt(errors);

  console.info('\n\n finished build\n', Object.keys(metafile.outputs));

  return true;
};

export const esbuildConfig = async (
  config: EsbuildConfigType
): Promise<ObjectType> =>
  esbuild.build(config).then((results) => (logResults(results), results));

export const esrunConfig = async (config: EsbuildConfigType): Promise<void> => {
  const useConfig = {
    ...config,
    watch: {
      async onRebuild(errors: Error, results: EsbuildResultsType): Promise<void> {
        if (errors) throwIt(errors);

        logResults(results);

        await startDev(useConfig);
      },
    },
  };

  await esbuildConfig(useConfig);
  await startDev(useConfig);
};
