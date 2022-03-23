// flow-typed signature: 3d1f4364066b78d078409952446484bf
// flow-typed version: c6154227d1/yamljs_v0.x.x/flow_>=v0.104.x

declare module "yamljs" {
  declare type Load = (path: string) => mixed;
  declare type Parse = (yaml: string) => mixed;
  declare type Stringify = (
    obj: mixed,
    inline?: number,
    spaces?: number
  ) => string;

  declare export default {
    load: Load,
    parse: Parse,
    stringify: Stringify,
    ...
  };
}
