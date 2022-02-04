// @flow

import { dirs, resolve } from '@nodeproto/wtf';
import { builtinModules } from 'module';
import { throwIt } from '@nodeproto/shared';

import {
  createOptimization,
  getInfrastructureLogging,
  getWebpackExperiments,
} from './utility.webpack.config';

import type {
  NodeprotoPackType,
  ObjectType,
  SupportedNodeEnvsType,
} from '../../libdefs';

// retrieves package.json, env metadata & utility logic (in pack object)
// sets webpack config items related to how webpack will run (and not what it outputs)
export const setupWebpackConfig = async ({
  context = process.cwd(),
  NODE_ENV = 'development',
  PATH_DIST = '',
  PATH_SRC = '',
}: {
  context?: string,
  NODE_ENV?: SupportedNodeEnvsType,
  PATH_DIST?: string,
  PATH_SRC?: string,
} = {}): Promise<{
  config: ObjectType,
  pack: NodeprotoPackType
}> => {
  const pkgJson = (await dirs.getPkgJson(context))?.file;

  if (!pkgJson) throwIt(`could not find package.json in ${context}`);

  // $FlowIgnore - will throw if path doesnt exist; see tests
  const pathDist: string = await resolve(PATH_DIST || pkgJson.config.PATH_DIST, true);
  // $FlowIgnore - will throw if path doesnt exist; see tests
  const pathSrc: string = await resolve(PATH_SRC || pkgJson.config.PATH_SRC, true);

  const mode: string = NODE_ENV || pkgJson.config.NODE_ENV;
  const ifProd: boolean = mode === 'production';
  const ifDev: boolean = mode === 'development';

  return {
    config: {
      context,
      experiments: getWebpackExperiments(),
      infrastructureLogging: getInfrastructureLogging(),
      mode,
      optimization: createOptimization(ifProd, pathDist), // debatable if this should be in base.webpack.config
    },

    pack: {
      builtinModules,
      ifDev,
      ifProd,
      pathDist,
      pathSrc,
      pkgJson,
    },
  };
};
