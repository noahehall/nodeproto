// @flow
// @see https://flow.org/en/docs/libdefs/creation/

export type ObjectOfSets = { [key: string]: Set<mixed> };
export type ObjectOfStringArrays = { [key: string]: string[] };
export type ObjectOfStringNumber = { [key: string]: string | number };
export type ObjectOfStrings = { [key: string]: string };
export type ObjectType = { [key: string]: mixed };
export type ObjectOfFunctions = { [key: string]: Function };

export type ArrayType = mixed[];

export interface ResolveInterface {
  (relativeFilePath: string, throwIfNotFound?: boolean): Promise<string | void>,
  (relativeFilePath: string, absoluteFilePath: string, throwIfNotFound?: boolean): Promise<string | void>,
  (relativeFilePath: string, importMeta: ImportMetaType, throwIfNotFound?: boolean): Promise<string | void>;
}
export type ImportMetaType = {
  resolve: (x: string, y?: string) => Promise<string>,
  url: string,
  ...
}

export type FileType = {
  data?: mixed,
  encoding?: string,
  filename: string,
};

export type StringContainerType = string | string[] | ObjectOfStrings

export type SupportedNodeEnvsType = 'development' | 'production';

export type PkgJsonType = {
  config?: {
    PATH_DIST: string,
    PATH_SRC: string,
    NODE_ENV: SupportedNodeEnvsType
  },
  jsync?: ObjectType,
  main?: string, // path to index.js|index.cjs,
  module?: string, // path to index.mjs
  name?: string,
  type?: string,
  version?: string,
  dependencies?: ObjectOfStrings,
  devDependencies?: ObjectOfStrings,
  ...
};
