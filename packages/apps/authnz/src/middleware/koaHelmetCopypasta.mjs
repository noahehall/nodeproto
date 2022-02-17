// @flow

// @see https://github.com/helmetjs/helmet/tree/main/middlewares
import * as helmetJsEverything from 'helmet';
import { promisify } from 'util';

import type { KoaHelmetType } from '../libdefs';

const { default: helmetDefault, ...helmetJs } = helmetJsEverything;

// @see https://github.com/venables/koa-helmet/blob/main/lib/koa-helmet.js
// basically a copypasta from venables
export const helmet: KoaHelmetType = Object.keys(helmetJs).reduce((acc, fnName) => {
  acc[fnName] = function () {
    const fnPromise = promisify(helmetJs[fnName].apply(null, arguments));

    acc[fnName]._name = `helmet.${fnName}`;

    return (ctx, next) => {
      return fnPromise(ctx.req, ctx.res).then(next);
    };
  };

  Object.keys(helmetJs[fnName]).forEach((fnExports) => {
    acc[fnName][fnExports] = helmetJs[fnName][fnExports];
  });

  return acc;
}, {});
