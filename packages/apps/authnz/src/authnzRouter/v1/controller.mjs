// @flow

/**
 *
 * TODO: https://github.com/steambap/koa-tree-router/issues/19
 */

import { dirs, resolve } from '@nodeproto/wtf';

// import handlers
import { koaOas3 } from '../../middleware/koaOas3';

const getImportMetaOrFilename = () => (dirs.isEsm() ? import.meta : __filename); // eslint-disable-line no-undef

export const controller = async (v1RouterGroup, app): Promise<void> => {
  try {
    /**
     * map v1 paths to handlers
     */
    const openApiUri = await resolve('./v1openapi.yaml', getImportMetaOrFilename());

    v1RouterGroup.get('/', koaOas3({ file: openApiUri, routepath: '/v1' }, app));
    // v1RouterGroup.get('/demo/pkgcheck', demo.pkgCheckHandler.getPkg);
    // @see https://github.com/steambap/koa-tree-router/issues/19
    // todo(noah):
    // fix this by friday night
    // v1RouterGroup.get('/demo/*notfound', demo.pkgCheckHandler.notFound);
  } catch (e) {
    // handle gracefully
    console.error('v1Controller erroor:', e);
  }
};
