
/**
 *
 * TODO: https://github.com/steambap/koa-tree-router/issues/19
 */

import { resolve, dirs } from '@nodeproto/wtf';

// import handlers
import * as demo from './demo/index.mjs';
import koaOas3 from '../../middleware/koaOas3.mjs';

export default async function v1Controller (v1RouterGroup, app) {
  try {
    /**
      * map v1 paths to handlers
    */
    const openApiUri = await resolve('./v1openapi.yaml', dirs.isEsm() ? import.meta : __filename);

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
