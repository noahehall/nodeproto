// @flow

export const isArray = (v: mixed): boolean => Array.isArray(v);
export const isBoolean = (v: mixed): boolean => typeof v === 'boolean';
export const isDate = (v: mixed): boolean => v instanceof Date;
export const isError = (v: mixed): boolean => v instanceof Error;
export const isFunction = (v: mixed): boolean => typeof v === 'function';
export const isMap = (v: mixed): boolean => v instanceof Map;
export const isNaN = (v: mixed): boolean => Number.isNaN(v);
export const isNull = (v: mixed): boolean => v === null;
export const isNumber = (v: mixed): boolean => typeof v === 'number';
export const isPromise = (v: mixed): boolean => v instanceof Promise;
export const isRegExp = (v: mixed): boolean => v instanceof RegExp;
export const isSet = (v: mixed): boolean => v instanceof Set;
export const isString = (v: mixed): boolean => typeof v === 'string';
export const isSymbol = (v: mixed): boolean => typeof v === 'symbol';
export const isUndefined = (v: mixed): boolean => v === undefined;
export const isWeakMap = (v: mixed): boolean => v instanceof WeakMap;
export const isWeakSet = (v: mixed): boolean => v instanceof WeakSet;

// works naturally, but not technically
export const isObject = (v: mixed): boolean => typeof v === 'object' && typeof v !== 'boolean' && !!v;
export const isValue = (v: mixed): boolean => !isObject(v);
