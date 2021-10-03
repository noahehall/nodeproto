// flow-typed signature: 5be6841572cbc7f247156b02124a18ac
// flow-typed version: e368cd16b1/@koa/cors_v3.x.x/flow_>=v0.53.x

declare module '@koa/cors' {
  declare type Middleware = (
    ctx: any,
    next: () => Promise<void>
  ) => Promise<void> | void;
  declare type Options = $Shape<{|
    // TODO better support the "function" use case.
    // This is a bit painful to type this object from scratch.
    origin: string | ((ctx: any) => string | Promise<string>),
    allowMethods: string | string[],
    exposeHeaders: string | string[],
    allowHeaders: string | string[],
    maxAge: string | number,
    credentials: boolean,
    keepHeadersOnError: boolean,
  |}>;

  declare module.exports: (options?: Options) => Middleware;
}
