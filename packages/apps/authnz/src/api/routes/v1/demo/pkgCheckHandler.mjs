// @flow

export const getPkg = async (ctx) => {
  return notFound(ctx);
};

export const notFound = async (ctx) => {
  ctx.body = 'todo(noah): handle not found gracefully\n';
};
