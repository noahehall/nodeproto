'use strict';
// TODO(noah)
// https://github.com/steambap/koa-tree-router/issues/19



// import handlers
import * as demo from './demo/index.mjs';
import v1Handler from './handler.mjs';


export default function v1Controller (v1RouterGroup) {
  try {
    /**
      * map v1 paths to handlers
      e.g. v1RouterGroup.get('/staledepchecker', staleDepCheckerHandler);
    */
    v1RouterGroup.get('/', v1Handler);
    v1RouterGroup.get('/demo/pkgcheck', demo.pkgCheckHandler.getPkg);
    // @see https://github.com/steambap/koa-tree-router/issues/19
    // todo(noah):
    // fix this by friday night
    // v1RouterGroup.get('/demo/*notfound', demo.pkgCheckHandler.notFound);

    return true;


  } catch (e) {
    // handle gracefully
    console.error('v1Controller', e)
    return false
  }
}
