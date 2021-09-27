
/**
 *
 * TODO: https://github.com/steambap/koa-tree-router/issues/19
 */

import { resolve, parentUri } from '@nodeproto/wtf/fsproto';

// import handlers
import * as demo from './demo/index.mjs';
import koaOas3 from '../../middleware/koaOas3.mjs';

export default async function v1Controller (v1RouterGroup, app) {
  try {
    /**
      * map v1 paths to handlers
    */
    // @see https://nodejs.org/api/esm.html#esm_import_meta_resolve_specifier_parent
    const openApiUri = await resolve('./v1openapi.yaml', parentUri(import.meta), import.meta);

    console.log('\n\n openApiUri', openApiUri);

    v1RouterGroup.get(
      '/',
      koaOas3(
        { file: openApiUri, routepath: '/v1' },
        app
      )
    );
    v1RouterGroup.get(
      '/demo/pkgcheck',
      demo.pkgCheckHandler.getPkg
    );
    // @see https://github.com/steambap/koa-tree-router/issues/19
    // todo(noah):
    // fix this by friday night
    // v1RouterGroup.get('/demo/*notfound', demo.pkgCheckHandler.notFound);
  } catch (e) {
    // handle gracefully
    console.error(
      'v1Controller erroor:',
      e
    )
  }
}
