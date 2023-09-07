"use strict";

const ApiKeyService = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];

    if (!key) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    //check API key
    const objKey = await ApiKeyService.checkKey(key);

    if (!objKey) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const permissions = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.objKey.permissions) {
        return res.status(403).json({ message: "Permission denied" });
      }

      if (!req.objKey.permissions.includes(permission)) {
        return res.status(403).json({ message: "Permission denied" });
      }

      return next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = { apiKey, permissions };
