'use strict';

import { oas } from 'koa-oas3';
import yaml from 'js-yaml';
import fs from 'fs';
import bodyParser from 'koa-bodyparser';
/**
 * @see https://github.com/atlassian/koa-oas3#oasoption
 */
const CONFIG = {
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
        json: ['application/json']
      },
      enableTypes: ['json']
    }),
    'text/*': bodyParser({
      extendTypes: {
        text: ['text/*']
      },
      enableTypes: ['text']
    }),
    'application/x-www-form-urlencoded': bodyParser({
      extendTypes: {
        form: ['application/x-www-form-urlencoded']
      },
      enableTypes: ['form']
    }),
  },
  enableUi: true,
  // validateResponse: false,
  // qsParseOptions: { comma: true },
};

export const oas3Handler = async (config, app) => {
  const oasMw = await oas(config);
  app.use(oasMw);
};

export default function koaOas3 (
  {
    file,
    spec,
    routepath,
    ...config
  } = {},
  app
) {
  if (!routepath)
    throw `String(routepath) required to load openApi UI`;
  if (!file && !spec)
    throw `atleast file|spec required in koaOas3`;

  // @see https://github.com/nodeca/js-yaml
  const useSpec = spec || yaml.load(
    fs.readFileSync(file, 'utf8')
  );

  const oas3Config = Object.assign(
    {
      spec: useSpec,
      endpoint: `${routepath}.json`,
      uiEndpoint: `${routepath}.html`,
    },
    CONFIG,
    config
  );

  oas3Handler(oas3Config, app);

  return async ctx => ctx.response.redirect(oas3Config.uiEndpoint)
}
