'use strict';

import { oas } from 'koa-oas3';

/**
 * @see https://github.com/atlassian/koa-oas3#oasoption
 */
const CONFIG = {
  file: 'absolute/path/openapi.yaml',
  // spec: dont use if you can use file:
  // validatePaths: array of paths
  // swaggerUiBundleBasePath: uhhh
  // errorHandler: custom error handler fn
  // requestBodyHandler: {
  //   'application/json': body({
  //     extendTypes: {
  //       json: ['application/json']
  //     },
  //     enableTypes: ['json']
  //   }),
  //   'text/*': bodyParser({
  //     extendTypes: {
  //       text: ['text/*']
  //     },
  //     enableTypes: ['text']
  //   }),
  //   'application/x-www-form-urlencoded': bodyParser({
  //     extendTypes: {
  //       form: ['application/x-www-form-urlencoded']
  //     },
  //     enableTypes: ['form']
  //   })
  enableUi: true,
  endpoint: '/openapi.json',
  uiEndpoint: '/openapi.html',
  validateResponse: true,
  qsParseOptions: { comma: true },
};

export default function koaOas3 (config = {}, app) {
  if (!config.file && !config. spec)
    throw `atleast file|spec required in koaOas3`;

  return oas(Object.assign({}, CONFIG, config));
}
