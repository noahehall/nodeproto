// @flow

export type ObjectOfSets = { [key: string]: Set<any> };
export type ObjectOfStringArrays = { [key: string]: string[] };
export type ObjectOfStrings = { [key: string]: string };
export type ObjectType = { [key: string]: any };

export type ArrayType = any[];

export type ImportMetaType = {
  resolve: (x: string, y?: string) => Promise<string>,
  url: string,
}

export type FileType = {
  data?: any,
  encoding?: string,
  filename: string,
};
