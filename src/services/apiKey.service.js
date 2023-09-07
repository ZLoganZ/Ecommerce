"use strict";

const apiKeyModel = require("../models/apiKey");
const crypto = require("crypto");

class ApiKeyService {
  static async checkKey(key) {
    // const newKey = await apiKeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });
    // console.log(newKey);
    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey || null;
  }
}

module.exports = ApiKeyService;
