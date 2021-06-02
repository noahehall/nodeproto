'use strict';

export default function spaHandler (ctx, next) {
  ctx.body = 'Hello Wurl';

  // next();

  // koabody
  if (ctx.request?.body)
    ctx.body += '\n\n' + JSON.stringify(ctx.request.body)

  // koa-session
  if (ctx.session?.views)
    ctx.body += '\n' + ctx.session.views + ' views';
};
