// @flow

import { fsproto, resolve } from '@nodeproto/wtf';
import { oas } from 'koa-oas3';

import bodyParser from 'koa-bodyparser';
import yaml from 'js-yaml';

import type { ControllerType, ObjectType } from '../../libdefs';

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
  const apiVersion = '/v1';
  const routePath = '/openapi';
  const v1Router = router.newGroup(apiVersion);

  const absFilePath = await resolve('./src/authnzRouter/v1/openapi.yaml');

  const config = Object.assign(
    {},
    koaOas3Config,
    {
      // file: absFilePath, // always use the spec property,
      endpoint: `${apiVersion}${routePath}.json`,
      spec: yaml.load(fsproto.fs.readFileSync(String(absFilePath),'utf8')),
      uiEndpoint: `${apiVersion}${routePath}`,
    },
  );

  const oas3Middleware = await oas(config);

  // first request: load swagger UI
  v1Router.get(routePath, oas3Middleware);
  // second request: load swagger spec
  v1Router.get(`${routePath}.json`, oas3Middleware);

  // @see https://github.com/steambap/koa-tree-router/issues/19
  // todo(noah):
  // fix this by friday night: lol this is already 20 years overdue, stop making promises
  // router.get('/demo/*notfound', demo.pkgCheckHandler.notFound);
};
