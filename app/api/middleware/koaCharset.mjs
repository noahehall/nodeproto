'use strict';

import charset from 'koa-charset';

export default function koaCharset (config, app) {
  return charset();
}
