// @see https://koajs.com/

import httpTerminator from 'http-terminator';
import Koa from 'koa';
import { dirs, isMain } from '@nodeproto/wtf';

export async function runApp({
  APP_PORT,
  APP_NAME,
  APP_HOST
} = {}) {
  const USE_PORT = APP_PORT || process.env.APP_PORT || 8081;
  const USE_NAME = APP_NAME || process.env.APP_NAME || 'koaHelloWorld';
  const USE_HOST = APP_HOST || process.env.APP_HOST || 'localhost';

  const app = new Koa();

  app.use(async ctx => {
    ctx.body = 'Hello World on rebuild2';
  });

  const controller = new AbortController();

  const config = {
    host: USE_HOST,
    port: USE_PORT,
    signal: controller.signal,
  };

  const server = app.listen(
    config,
    () =>  console.info(`${USE_NAME} running on: ${USE_PORT}`)
  );

  // @see https://github.com/gajus/http-terminator
  // @see https://github.com/gajus/http-terminator/blob/master/test/http-terminator/factories/createInternalHttpTerminator.ts
  // @see https://github.com/webpack/webpack-dev-middleware/blob/master/test/middleware.test.js
  return {
    app,
    config,
    // controller.abort() -> prohibit incoming connections to koa http server;
    controller,
    // likely you want to use this in a real env
    // especially if you expect there to be an unknown amount of connections
    // await httpTerminator.terminate();
    httpTerminator:  httpTerminator.createHttpTerminator({ server }),
    server,
    // await webpackDevMiddlewareInstance.close() -> close webpack dev server;
  };
}

if (isMain(dirs.isEsm() ? require.main : import.meta)) runApp();
