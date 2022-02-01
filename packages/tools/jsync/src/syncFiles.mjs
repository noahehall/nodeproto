// @flow

import {
  FORCE_VALUES,
  IGNORE_VALUES,
  SPREAD_VALUES,
} from './constants';

import {
  isObject,
  isValue,
  sortObject,
} from '@nodeproto/shared';


import type {
  ObjectOfSets,
  ObjectOfStringArrays,
  ObjectType,
} from '@nodeproto/configproto/libdefs';

// categorizes this json field as either ignore, force, or spread
export const getJsonFieldCategory = (jsyncFieldCategories: ObjectOfSets, field: string): string =>
  (jsyncFieldCategories[SPREAD_VALUES].has(field) && SPREAD_VALUES) ||
  (jsyncFieldCategories[FORCE_VALUES].has(field) && FORCE_VALUES) ||
  IGNORE_VALUES;

export const getFieldCategories = (jsyncConfig: ObjectType): ObjectOfSets => {
  const fieldCategories = {}; // container for all the json segments

  const
    forceRootValues: string[] = jsyncConfig[FORCE_VALUES],
    ignoreRootValues: string[] = jsyncConfig[IGNORE_VALUES],
    spreadRootValues: string[] = jsyncConfig[SPREAD_VALUES]
  ;

  fieldCategories[IGNORE_VALUES] = new Set(ignoreRootValues);

  // values to force
  // these root values will be set in child package.json
  fieldCategories[FORCE_VALUES] = new Set(forceRootValues.filter((v) => !fieldCategories[IGNORE_VALUES].has(v)));

  // these values will never be spread into child.package.json
  const valuesToNeverSpread = new Set([...fieldCategories[IGNORE_VALUES]].concat([...fieldCategories[FORCE_VALUES]]));

  // these values will be spread into child from root
  // values to spread
  fieldCategories[SPREAD_VALUES] = new Set(spreadRootValues.filter((v) => !valuesToNeverSpread.has(v)));

  return fieldCategories;
};

export const segmentJsonFieldsByCategory = ({
  defaultJsyncConfig,
  fieldNames,
  rootJsyncConfig,
  }: {
    fieldNames: string[],
    rootJsyncConfig: ObjectType,
    defaultJsyncConfig: ObjectType,
  }
): {
  fieldCategories: ObjectOfStringArrays,
  jsyncFieldCategories: ObjectType,
} => {
  const jsyncFieldCategories = getFieldCategories({
    ...defaultJsyncConfig,
    ...rootJsyncConfig
  });

  console.info('\n\n jsyncFieldCategories', jsyncFieldCategories);

  let category;
  const fieldCategories = fieldNames.reduce(
    (acc, k) =>
      Object.assign(
        acc,
        ((category = getJsonFieldCategory(jsyncFieldCategories, k)),
        {
          [category]: acc[category].concat(k),
        })
      ),
    { [SPREAD_VALUES]: [], [IGNORE_VALUES]: [], [FORCE_VALUES]: [] }
  );

  return {
    fieldCategories,
    jsyncFieldCategories
  };
};

export const syncJsonFields = ({
  force = false,
  fromJson,
  keys,
  toJson,
  jsyncFieldCategories,
}: {
  force: boolean,
  fromJson: ObjectType,
  keys: string[],
  toJson: ObjectType,
  jsyncFieldCategories: ObjectOfSets,
}): ObjectType => {
  const jsonObj = {};

  for (const k of keys) {
    const rootValue = fromJson[k];
    const childValue = toJson[k];
    const missing = !(k in toJson);

    // takes priority over everything
    // set the value if forced or missing
    if (force || missing) {
      jsonObj[k] = rootValue;

      jsyncFieldCategories[IGNORE_VALUES].add(k);
    }

    if (jsyncFieldCategories[IGNORE_VALUES].has(k)) continue;
    // set the value only if missing: use force above to override
    else if (isValue(rootValue)) {
      if (isValue(childValue) && missing) jsonObj[k] = rootValue;
      else jsonObj[k] = childValue;
    }
    // take set of root & child values
    else if (Array.isArray(rootValue)) {
      if (Array.isArray(childValue))
        jsonObj[k] = Array.from(new Set(rootValue.concat(childValue || [])));
      else jsonObj[k] = childValue;
    }
    // using rudimentary check for object
    // but has to be an object based on previous checks
    else if (isObject(rootValue)) {
      if (isObject(childValue))
        // root takes precedence to get updated values (if any) on subsequent runs
        jsonObj[k] = { ...(childValue || {}), ...rootValue };
      else jsonObj[k] = childValue;
    }

    jsyncFieldCategories[IGNORE_VALUES].add(k);
  }

  return jsonObj;
};

// creates a new json object with values from root and child
export const syncJsonFiles = ({
  childPkgJson,
  defaultFieldCategory,
  fieldCategories,
  jsyncFieldCategories,
  rootJson,
}: {
  childPkgJson: ObjectType,
  defaultFieldCategory: string,
  fieldCategories: {[x: string]: string[]},
  jsyncFieldCategories: {[x: string]: Set<string>},
  rootJson: ObjectType,
}): ObjectType => {
  // force values from root to child
  const fieldsForced: ObjectType = syncJsonFields({
    force: true,
    fromJson: rootJson,
    jsyncFieldCategories,
    keys: fieldCategories[FORCE_VALUES],
    toJson: childPkgJson.file,
  });

  // spread values from root to child
  const fieldsSpread: ObjectType = syncJsonFields({
    force: false,
    fromJson: rootJson,
    jsyncFieldCategories,
    keys: fieldCategories[SPREAD_VALUES],
    toJson: childPkgJson.file,
  });

  // handle remaining root fields not present in jsync config
  // if we are not ignoring fields by default
  const fieldsRemaining: ObjectType = defaultFieldCategory === IGNORE_VALUES
    ? {}
    : syncJsonFields({
      force: defaultFieldCategory === FORCE_VALUES,
      fromJson: rootJson,
      jsyncFieldCategories,
      keys: Object.keys(rootJson).filter((k) => !jsyncFieldCategories[IGNORE_VALUES].has(k)),
      toJson: childPkgJson.file,
    });

  return sortObject({
    ...childPkgJson.file,
    ...fieldsForced,
    ...fieldsSpread,
    ...fieldsRemaining,
  });
};
