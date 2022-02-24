// @flow

import { dirs, resolve } from '@nodeproto/wtf';
import { builtinModules } from 'module';
import { throwIt } from '@nodeproto/shared';

import type { NodeprotoPackOptionsType, NodeprotoPackType } from './libdefs';

export const pack = async ({
  context = process.cwd(),
  NODE_ENV = process.env.NODE_ENV || 'development',
  PATH_DIST = '',
  PATH_SRC = '',
  writeToDisk = false,
}: NodeprotoPackOptionsType = {}): Promise<NodeprotoPackType> => {
  const pkgJson = (await dirs.getPkgJson(context)).file;

  if (!pkgJson) throwIt(`could not find package.json in ${context}`);

  // $FlowFixMe[incompatible-use]
  // $FlowFixMe[incompatible-type]
  // $FlowFixMe[incompatible-call]
  const pathDist: string = await resolve(PATH_DIST || pkgJson.config.PATH_DIST, true);
  // $FlowFixMe[incompatible-use]
  // $FlowFixMe[incompatible-type]'development'
  const pathSrc: string = await resolve(PATH_SRC || pkgJson.config.PATH_SRC, true);

  const ifProd: boolean = NODE_ENV === 'production';
  const ifDev: boolean = !ifProd;

  return {
    // $FlowFixMe[incompatible-return]
    builtinModules,
    context,
    ifDev,
    ifProd,
    NODE_ENV,
    pathDist,
    pathSrc,
    // $FlowFixMe[incompatible-return]
    pkgJson,
    writeToDisk,
  };
};
