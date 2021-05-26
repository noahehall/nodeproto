'use strict';

// TODO(noah)
// +body should be set by the router, not this shit
import { isFaviconRequest } from "../shared.mjs";
// TODO
// how is the koa community doing this?
export default function appBody (app) {
  return async (ctx, next) => {

    ctx.body = 'Hello Wurl';

    // TODO
    // babel wheres my .? operator
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;

    next();

    // koabody
    if (ctx.request.body)
      ctx.body += '\n\n' + JSON.stringify(ctx.request.body)

    // koa-session
    // ignore favicon
    // https://github.com/koajs/session#example
    if (!isFaviconRequest(ctx.path)) {
      ctx.body += '\n' + ctx.session.views + ' views';
    }
  };
}
