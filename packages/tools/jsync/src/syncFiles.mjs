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
  throwIt,
} from '@nodeproto/shared';


import type {
  JsyncConfigType,
  ObjectOfSets,
  ObjectOfStrings,
  PkgJsonType,
} from './libdefs';

export const availableActions: Set<string> = new Set([FORCE_VALUES, IGNORE_VALUES, SPREAD_VALUES]);

// converts jsync config object of arrays into object of sets
// and ensures fields are unique across sets
export const getFieldCategories = (config: JsyncConfigType): ObjectOfSets => {
  const fieldCategories = {}; // container for all the json segments

  const
    forceRootValues: string[] = config[FORCE_VALUES],
    ignoreRootValues: string[] = config[IGNORE_VALUES],
    spreadRootValues: string[] = config[SPREAD_VALUES]
  ;

  // takes precedence over everything else (always ignores jsync config)
  // debatable if force should take precedence
  // maybe we should call this `set` instead of `force`
  fieldCategories[IGNORE_VALUES] = (new Set(ignoreRootValues).add('jsync'));

  // values to force from root to child
  fieldCategories[FORCE_VALUES] = new Set(forceRootValues.filter((v) => !fieldCategories[IGNORE_VALUES].has(v)));

  // remove any values that are ignored, or forced
  const valuesToNeverSpread = new Set([...fieldCategories[IGNORE_VALUES]].concat([...fieldCategories[FORCE_VALUES]]));

  // values to spread from root to child
  fieldCategories[SPREAD_VALUES] = new Set(spreadRootValues.filter((v) => !valuesToNeverSpread.has(v)));

  return fieldCategories;
};

// categorizes a specific field as either ignore, force, or spread
export const getFieldCategory = ({
  defaultAction,
  field,
  fieldCategories,
}: {
  defaultAction: string,
  field: string,
  fieldCategories: ObjectOfSets,
}): string =>
  (fieldCategories[SPREAD_VALUES].has(field) && SPREAD_VALUES) ||
  (fieldCategories[FORCE_VALUES].has(field) && FORCE_VALUES) ||
  (fieldCategories[IGNORE_VALUES].has(field) && IGNORE_VALUES) ||
  (availableActions.has(defaultAction) && defaultAction)
  // $FlowIssue[incompatible-return]
  || throwIt(`${defaultAction} is not a valid action`);

// extracts each field in a json field
// and assigns it to the category in the jsync config
export const getFieldsByCategory = ({
  config,
  fieldNames,
  }: {
    config: JsyncConfigType,
    fieldNames: string[],
  }
): ObjectOfStrings => {
  const fieldCategories = getFieldCategories(config);

  const fieldsByCategory = fieldNames.reduce(
    (acc, field) => Object.assign(
      acc,
      {
        [field]: getFieldCategory({
          defaultAction: config.defaultAction,
          field,
          fieldCategories,
          }),
      }
    ),
    {}
  );

  return fieldsByCategory;
};

export const syncFields = ({
  fromJson,
  toJson,
  fieldsByCategory,
}: {
  fromJson: PkgJsonType,
  toJson: PkgJsonType,
  fieldsByCategory: ObjectOfStrings,
}): PkgJsonType => {
  const jsonObj = {};

  for (const field in fieldsByCategory) {
    const rootValue = fromJson[field];
    const childValue = toJson[field];
    const action = fieldsByCategory[field];

    switch(action) {
      case FORCE_VALUES: {
        jsonObj[field] = rootValue;
        break;
      }
      case SPREAD_VALUES: {
        if (Array.isArray(rootValue)) {
          const childValueIsArray = Array.isArray(childValue);
          if (!childValueIsArray) console.warn(`
            ignoring child field "${field}": it should be an array to spread
            received: ${childValue}
          `);
          jsonObj[field] = Array.from(new Set(rootValue.concat(childValueIsArray ? childValue : [])));
        }
        else if (isObject(rootValue)) {
          const childValueIsObject = isObject(childValue);
          if (!childValueIsObject) console.warn(`
            ignoring child field "${field}": it should be an object to spread
            received: ${childValue}
          `);
          jsonObj[field] = {
            ...(childValueIsObject ? childValue : {}),
            ...rootValue
          };
        }
        else {
          console.warn(`
            ignoring root field "${field}": it should be array/object to spread
            received: ${rootValue}
          `);
        }
      }
    }
  }

  return Object.freeze({ ...jsonObj });
};

// creates a new json object with values from root and child
export const syncFiles = ({
  childJson,
  config,
  rootJson,
}: {
  childJson: PkgJsonType,
  config: JsyncConfigType,
  rootJson: PkgJsonType,
}): PkgJsonType => {
  // assign each rootJson field to a category
  const fieldsByCategory: ObjectOfStrings = getFieldsByCategory({
    config,
    fieldNames: Object.keys(rootJson),
  });

  // sync (ignore > force > spread) rootJson fields with childJson fields
  const syncedFields = syncFields({
    fromJson: rootJson,
    fieldsByCategory,
    toJson: childJson,
  });

  // override childJson fields with fields synced from rootJson
  // then sort the object: by name, simple values before complex values
  return Object.freeze(sortObject(Object.assign({}, childJson, syncedFields)));
};
