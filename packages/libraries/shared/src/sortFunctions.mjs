// @flow

export const isObject = (v: {[x: string]: any}) => typeof v === 'object' && v !== null;
export const isValue = (v) => !isObject(v) && !Array.isArray(v);

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
export const sortSimpleThenComplexDataTypes = (a, b) => {
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

export const sortArraysAndObjects = (key, value) =>
  isValue(value) || key === 'exports'
    ? value
    : Array.isArray(value)
    ? value.sort((a, b) => a.localeCompare(b))
    : Object.entries(value)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((obj, [key, value]) => ((obj[key] = value), obj), {});
