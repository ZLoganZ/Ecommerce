"use strict";

const keyTokenModel = require("../models/keyToken");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    // try {
    const tokens = await keyTokenModel.create({
      user: userId,
      publicKey,
      privateKey,
    });

    return tokens || null;
    // } catch (error) {
    //   throw error;
    // }
  };
}

module.exports = KeyTokenService;
