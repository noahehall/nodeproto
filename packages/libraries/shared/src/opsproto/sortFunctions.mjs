// @flow

import { isObject, isString, isValue } from './utility';

import type { ArrayType, ObjectType } from '@nodeproto/configproto/libdefs'; // eslint-disable-line

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
export const sortSimpleThenComplexDataTypes = (a: any, b :any): number => {
  // sort simple types before complex types
  if (isValue(a[1]) && isValue(b[1])) {
    return a[0].localeCompare(b[0]);
  }

  // sort the simple type before the complex type
  if (isValue(a[1])) return -1;
  else if (isValue(b[1])) return 1;
  // sort complex types alphabetically
  else return a[0].localeCompare(b[0]);
};

// never sort a package.jsons exports field
export const sortArraysAndObjects = (key: string, value: any): ObjectType | ArrayType | string =>
  isValue(value) || key === 'exports'
    ? value
    : Array.isArray(value)
    ? value.sort((a, b) => String(a).localeCompare(String(b)))
    : Object.entries(value)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((obj, [key, value]) => ((obj[key] = value), obj), {});

export const sortObject = (obj: ObjectType): ObjectType => Object.entries(obj)
  .sort(sortSimpleThenComplexDataTypes)
  .reduce((obj, [key, value]) => ((obj[key] = sortArraysAndObjects(key, value)), obj), {});
