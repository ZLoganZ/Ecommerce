"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const getUnSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((item) => [item, 0]));
};

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
};
