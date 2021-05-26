'use strict';

    // TODO
    // babel wheres my .? operator
    // let n = ctx.session.views || 0;
    // ctx.session.views = ++n;

    // koa-session
    // ignore favicon
    // https://github.com/koajs/session#example
    // TODO(noah)
    // +should be handled elseware, not this shit
    // +check koajs/examples/conditional-shit
    // if (!isFaviconRequest(ctx.path)) {
    //   ctx.body += '\n' + ctx.session.views + ' views';
    // }


export default function landingPageHandler (ctx) {
  ctx.body = 'Hello Wurl';

  // koabody
  if (ctx.request.body)
    ctx.body += '\n\n' + JSON.stringify(ctx.request.body)

  // koa-session
  if (ctx.session.views)
    ctx.body += '\n' + ctx.session.views + ' views';
};
