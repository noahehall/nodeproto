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
  NodeprotoPackType,
  ObjectType,
} from '../libdefs';

const servers: NodeprotoEsbuildServerTrackerType = new Map();

export const stopDev = async (config: EsbuildConfigType): Promise<void> => {
  if (!config.entryPoints) return void 0;

  const runningServer: NodeprotoEsbuildServerInstanceType | void = servers.get(config.entryPoints);

  if (!runningServer) return void 0;

  const { httpTerminator, server, controller } = runningServer;

  if (httpTerminator) await httpTerminator.terminate();
  else if (controller) await controller.abort();
  else if (server) await server.close();
  else throwIt('retrieved app doesnt contain httpTerminator|server|controller properties');
};

export const startDev = async ({
  config,
  pack
}: {
  config: EsbuildConfigType,
  pack: NodeprotoPackType
}): Promise<typeof servers | void> => {
  await stopDev(config);

  if (!config.entryPoints) return void 0;

  let
    manifest: ObjectType,
    server: NodeprotoEsbuildServerType | void,
    serverPath: string
  ;

  try {
    // TODO: will break if consumer uses a different manifest name
    manifest = JSON.parse(
      await fsproto.fs.readFile(pack.pathDist + '/' + 'manifest.json', 'utf-8')
    );

    // TODO: will likely break if consumer has multiple entyrpoints and hte first isnt the server
    if (!manifest) throwIt('esbuild manifest not found');

    const foundServerPath = Object.values(manifest)[0];
    if (typeof foundServerPath !== 'string') throwIt('esbuild server path not found');
    else {
      serverPath = pack.pathDist + '/' + foundServerPath.split('/').pop();
    }

    try {
      // $FlowIssue[unsupported-syntax]
      server = await import(serverPath);
    } catch (e) {
      console.error('\n\n error importing serverPath', serverPath);

      throwIt(e);
    }

    if (!server?.runApp) throwIt('server does not contain runApp fn');
    // $FlowFixMe[incompatible-call]
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
  if (errors.length) throwIt(`errors exist, stopping server`, errors);

  console.info('\n\n finished build\n', Object.keys(metafile.outputs));

  return true;
};

export const esbuildCompileConfig = async (
  config: EsbuildConfigType
): Promise<ObjectType> =>
  esbuild.build(config).then((results) => (logResults(results), results));

export const esbuildRunConfig = async ({
  config, pack
}: {
  config: EsbuildConfigType,
  pack: NodeprotoPackType
} ): Promise<void> => {
  const useConfig = {
    ...config,
    watch: {
      async onRebuild(errors: Error, results: EsbuildResultsType): Promise<void> {
        if (errors) throwIt(errors);

        logResults(results);

        await startDev({ config: useConfig, pack });
      },
    },
  };

  await esbuildCompileConfig(useConfig);
  await startDev({ config: useConfig, pack });
};
