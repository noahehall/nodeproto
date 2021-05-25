'use strict';

import cors from '@koa/cors';

// @see https://github.com/koajs/cors#corsoptions
export default function koaCors (config, app) {
  return cors();
}
