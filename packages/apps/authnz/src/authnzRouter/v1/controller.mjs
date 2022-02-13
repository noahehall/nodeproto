// @flow

import { fsproto, resolve } from '@nodeproto/wtf';
import { oas } from 'koa-oas3';

import bodyParser from 'koa-bodyparser';
import yaml from 'js-yaml';

import type { ControllerType, ObjectType } from '../../libdefs';

export const koaOas3Config: ObjectType = {
  // file: 'absolute/path/openapi.yaml',
  // spec: dont use if you can use file:
  // validatePaths: array of paths
  // swaggerUiBundleBasePath: uhhh
  // errorHandler: custom error handler fn
  // endpoint: '/v1.json', // dynamically set via routepath
  // uiEndpoint: '/v1.html', // dynamically set via routepath
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
  const routepath = '/v1';
  const v1Router = router.newGroup(routepath);

  try {
    const absFilePath = await resolve('./src/authnzRouter/v1/openapi.yaml');

    const useSpec = yaml.load(
      fsproto.fs.readFileSync(String(absFilePath),'utf8')
    );

    const oas3Config = Object.assign(
      {},
      koaOas3Config,
      {
        // file: absFilePath, // always use the spec property,
        endpoint: `${routepath}.json`,
        spec: useSpec,
        uiEndpoint: `${routepath}.html`,
      },
    );

    app.context.config.oas3Config = oas3Config;

    const oas3Middleware = await oas(oas3Config);

    v1Router.get('/', oas3Middleware);
    // router.get('/demo/pkgcheck', demo.pkgCheckHandler.getPkg);

    // @see https://github.com/steambap/koa-tree-router/issues/19
    // todo(noah):
    // fix this by friday night
    // router.get('/demo/*notfound', demo.pkgCheckHandler.notFound);
  } catch (e) {
    // handle gracefully
    console.error('v1Controller erroor:', e);
  }
};
