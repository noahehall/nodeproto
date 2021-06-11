'use strict';


export function getPkg (ctx) {
  return notFound(ctx);
}


export function notFound (ctx) {
  ctx.body = 'todo(noah): handle not found gracefully\n';
}
