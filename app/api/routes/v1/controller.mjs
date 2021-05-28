'use strict';
/**
 *
 * TODO: https://github.com/steambap/koa-tree-router/issues/19
 */

import { resolve } from '../../shared.mjs';

// import handlers
import * as demo from './demo/index.mjs';
import v1Handler from './handler.mjs';
import koaOas3 from '../../middleware/koaOas3.mjs';

/// import oas3middlewaare
// use it as route handler for /v1

export default async function v1Controller (v1RouterGroup, app) {
  try {
    /**
      * map v1 paths to handlers
      e.g. v1RouterGroup.get('/staledepchecker', staleDepCheckerHandler);
    */
    // @see https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent
    // await import.meta.resolve('../v1/openapi.yaml', import.meta.url)
    const openApiUri = await resolve(
      '../v1/openapi.yaml',
      import.meta.url
    );

    // console.log(openApiUri)


    v1RouterGroup.get('/', koaOas3({ file: openApiUri }, app));
    v1RouterGroup.get('/demo/pkgcheck', demo.pkgCheckHandler.getPkg);
    // @see https://github.com/steambap/koa-tree-router/issues/19
    // todo(noah):
    // fix this by friday night
    // v1RouterGroup.get('/demo/*notfound', demo.pkgCheckHandler.notFound);

  } catch (e) {
    // handle gracefully
    console.error('v1Controller erroor:', e)
  }
}
