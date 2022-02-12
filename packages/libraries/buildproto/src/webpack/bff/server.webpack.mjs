// @flow

import httpTerminator from 'http-terminator';
import Koa from 'koa';
import middleware from 'webpack-dev-middleware-2';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware-2';

import { isObject, isString, throwIt } from '@nodeproto/shared';

import type {
  NodeprotoPackType,
  NodeprotoWebpackServerType,
  ObjectType,
  WebpackConfigType,
} from '../../libdefs';

export const webpackServer = ({
  CLIENT_PORT = 8080,
  HOST_IP = '0.0.0.0',
  pack,
  config,
}: {
  HOST_IP?: string,
  CLIENT_PORT?: number,
  pack: NodeprotoPackType,
  config: WebpackConfigType,
}): NodeprotoWebpackServerType => {
  if (!isObject(pack) || !isObject(config))
    throwIt('both pack & config must be objects');

  // @see https://webpack.js.org/guides/public-path/#root
  if (!isString(config.output?.publicPath))
    throwIt('config.output.publicPath should be a string');

  const APP_NAME: string = pack.pkgJson.name || 'node BFF via @nodeproto/buildproto';
  const compiler = webpack(config);

  const webpackDevMiddlewareInstance = middleware(compiler, {
    publicPath: config.output?.publicPath,
    stats: 'errors-warnings',
    useBff: 'useKoa2',
    writeToDisk: !!pack.writeToDisk,
  });

  const app = new Koa();

  app.use(webpackDevMiddlewareInstance);

  app.use(webpackHotMiddleware(compiler, { useBff: 'useKoa2' }));

  const controller = new AbortController();

  const cidr = {
    host: HOST_IP,
    port: CLIENT_PORT,
    signal: controller.signal,
  };

  const server = app.listen(
    cidr,
    () => console.info(`${APP_NAME} running on: ${CLIENT_PORT}`)
  );

  // @see https://github.com/gajus/http-terminator
  // @see https://github.com/gajus/http-terminator/blob/master/test/http-terminator/factories/createInternalHttpTerminator.ts
  // @see https://github.com/webpack/webpack-dev-middleware/blob/master/test/middleware.test.js
  // await webpackDevMiddlewareInstance.close() -> close webpack dev server;
  // controller.abort() -> generally should shutdown server, but prefer httpTerminate;
  // http: terminate likely you want to use this in a real env
  // especially if you expect there to be an unknown amount of connections
  // await httpTerminator.terminate();
  return {
    app,
    cidr,
    compiler,
    controller,
    httpTerminator: httpTerminator.createHttpTerminator({ server }),
    server,
    webpackDevMiddlewareInstance,
  };
};
