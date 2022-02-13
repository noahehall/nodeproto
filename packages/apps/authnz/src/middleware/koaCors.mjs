// @flow


import cors from '@koa/cors';

import type { MiddlewareFactoryType } from '../libdefs';

export const koaCors: MiddlewareFactoryType = (app) => {
  // @see https://github.com/koajs/cors#corsoptions
  return cors();
};
