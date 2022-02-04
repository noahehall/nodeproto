// @flow

import httpTerminator from 'http-terminator';
import Koa from 'koa';
import middleware from 'webpack-dev-middleware-2';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware-2';

import { isString, throwIt } from '@nodeproto/shared';

import type {
  NodeprotoPackType,
  NodeprotoWebpackServerType,
  ObjectType,
  WebpackConfigType,
} from '../../../libdefs';

export const webpackServer = ({
  CLIENT_PORT = 8080,
  HOST_IP = '0.0.0.0',
  pack,
  webpackConfig,
}: {
  HOST_IP?: string,
  CLIENT_PORT: number,
  pack: NodeprotoPackType,
  webpackConfig: WebpackConfigType,
}): NodeprotoWebpackServerType => {
  if (!isString(webpackConfig.output?.publicPath))
    throwIt('webpackConfig.output.publicPath should be a string');

  const APP_NAME: string = pack.pkgJson.name;
  const compiler = webpack(webpackConfig);

  const webpackDevMiddlewareInstance = middleware(compiler, {
    publicPath: webpackConfig.output?.publicPath,
    stats: 'errors-warnings',
    useBff: 'useKoa2',
    writeToDisk: pack.writeToDisk,
  });

  const app = new Koa();

  app.use(webpackDevMiddlewareInstance);

  app.use(webpackHotMiddleware(compiler, { useBff: 'useKoa2' }));

  const controller = new AbortController();

  const config = {
    host: HOST_IP,
    port: CLIENT_PORT,
    signal: controller.signal,
  };

  const server = app.listen(
    config,
    () => console.info(`${APP_NAME} running on: ${CLIENT_PORT}`)
  );

  // @see https://github.com/gajus/http-terminator
  // @see https://github.com/gajus/http-terminator/blob/master/test/http-terminator/factories/createInternalHttpTerminator.ts
  // @see https://github.com/webpack/webpack-dev-middleware/blob/master/test/middleware.test.js
  return {
    app,
    compiler,
    config,
    // controller.abort() -> generally should shutdown server, but prefer httpTerminate;
    controller,
    // likely you want to use this in a real env
    // especially if you expect there to be an unknown amount of connections
    // await httpTerminator.terminate();
    httpTerminator: httpTerminator.createHttpTerminator({ server }),
    server,
    // await webpackDevMiddlewareInstance.close() -> close webpack dev server;
    webpackDevMiddlewareInstance,
  };
};
