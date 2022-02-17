// @flow

import { fsproto, resolve } from '@nodeproto/wtf';
import { oas } from 'koa-oas3';

import bodyParser from 'koa-bodyparser';
import yaml from 'js-yaml';

import type { ControllerType, ObjectType } from '../../../libdefs';

export const koaOas3Config: ObjectType = {
  // validatePaths: array of paths
  // swaggerUiBundleBasePath: uhhh
  // errorHandler: custom error handler fn
  requestBodyHandler: {
    'application/json': bodyParser({
      extendTypes: {
        json: ['application/json'],
      },
      enableTypes: ['json'],
    }),
    'text/*': bodyParser({
      extendTypes: {
        text: ['text/*'],
      },
      enableTypes: ['text'],
    }),
    'application/x-www-form-urlencoded': bodyParser({
      extendTypes: {
        form: ['application/x-www-form-urlencoded'],
      },
      enableTypes: ['form'],
    }),
  },
  enableUi: true,
  // validateResponse: false,
  // qsParseOptions: { comma: true },
};

export const controller: ControllerType = async (router, app): Promise<void> => {
  // localhost:3443/authnz/v1/openapi
  const routerName = '/authnz';
  const apiVersion = '/v1';
  const openApiPath = '/openapi';

  const v1Router = router.newGroup(`${routerName}${apiVersion}`);

  const absFilePath = await resolve('./authnz.v1.openapi.yaml', import.meta);

  const config = Object.assign(
    {},
    koaOas3Config,
    {
      // file: absFilePath, // always use the spec property,
      endpoint: `${routerName}${apiVersion}${openApiPath}.json`,
      spec: yaml.load(fsproto.fs.readFileSync(String(absFilePath),'utf8')),
      uiEndpoint: `${routerName}${apiVersion}${openApiPath}`,
    },
  );

  const oas3Middleware = await oas(config);

  // first request: load swagger UI
  v1Router.get(openApiPath, oas3Middleware);
  // second request: load swagger spec
  v1Router.get(`${openApiPath}.json`, oas3Middleware);

  // @see https://github.com/steambap/koa-tree-router/issues/19
  // todo(noah):
  // fix this by friday night: lol this is already 20 years overdue, stop making promises
  // router.get('/demo/*notfound', demo.pkgCheckHandler.notFound);
};
