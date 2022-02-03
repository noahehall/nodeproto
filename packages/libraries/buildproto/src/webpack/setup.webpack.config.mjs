// @flow

import { dirs, resolve } from '@nodeproto/wtf';
import { builtinModules } from 'module';
import { throwIt } from '@nodeproto/shared';

import { createOptimization } from './utility.webpack.config';

import type {
  NodeprotoPackType,
  ObjectType,
} from '../../libdefs';

// retrieves package.json, env metadata & utility logic (in pack object)
// sets webpack config items related to how webpack will run (and not what it outputs)
export const setupWebpackConfig = async ({
  context = process.cwd(),
  NODE_ENV = 'development',
}: {
  context?: string,
  NODE_ENV?: string,
} = {}): Promise<{
  config: ObjectType,
  pack: NodeprotoPackType
}> => {
  const pkgJson = (await dirs.getPkgJson(context))?.file;
  if (!pkgJson) throwIt(`could not find package.json in ${context}`);

  const pathDist: string = (await resolve(pkgJson.config.PATH_DIST)) || '';
  const pathSrc: string = (await resolve(pkgJson.config.PATH_SRC)) || '';
  if (!pathDist || !pathSrc) {
    throwIt(`PATH_DIST or PATH_SRC is not defined in package.json.config`);
  }

  const mode: string = NODE_ENV || pkgJson.config.NODE_ENV;
  const ifProd: boolean = mode === 'production';
  const ifDev: boolean = mode === 'development';

  return {
    config: {
      context,
      mode,
      optimization: createOptimization(ifProd, pathDist),
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
