'use strict';

const _ = require('lodash');

/**
 * The function `getInfoData` takes an array of fields and an object, and returns a new object
 * containing only the specified fields from the original object.
 * @param [fields] - An array of strings representing the fields that you want to extract from the
 * object.
 * @param [object] - The `object` parameter is an object that contains the data from which we want to
 * extract specific fields.
 * @returns The function `getInfoData` returns an object that contains only the specified fields from
 * the input object.
 */
const getInfoData = (fields = [], object = {}) => {
  return _.pick(object, fields);
};

/**
 * The function `getSelectData` takes an array of values and returns an object with each value as a key
 * and the value set to 1.
 * @param [select] - The `select` parameter is an array that contains the items to be used as keys in
 * the resulting object.
 * @returns The function `getSelectData` returns an object where the keys are the elements of the
 * `select` array, and the values are all set to 1.
 */
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

/**
 * The function `getUnSelectData` takes an array of items and returns an object with each item as a key
 * and the value set to 0.
 * @param [unSelect] - An array of items that need to be converted into an object with each item as a
 * key and the value set to 0.
 * @returns The function `getUnSelectData` returns an object where the keys are the elements of the
 * `unSelect` array and the values are all set to 0.
 */
const getUnSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};

/**
 * The `removeUndefined` function removes any properties with undefined or null values from an object.
 * @param [object] - The `object` parameter is an optional parameter that represents an object. If no
 * object is provided, an empty object will be used as the default value.
 * @returns The function `removeUndefined` returns an object with any properties that have a value of
 * `undefined` or `null` removed.
 */
const removeUndefined = (object = {}) => {
  return _.omitBy(object, _.isUndefined, _.isNull);
};

const updateNestedObject = (object = {}) => {
  const final = {};

  Object.keys(object).forEach((key) => {
    if (
      typeof object[key] === 'object' &&
      object[key] !== null &&
      !Array.isArray(object[key])
    ) {
      const result = updateNestedObject(object[key]);
      Object.keys(result).forEach((childKey) => {
        final[`${key}.${childKey}`] = result[childKey];
      });
    } else {
      final[key] = object[key];
    }
  });

  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefined,
  updateNestedObject
};
