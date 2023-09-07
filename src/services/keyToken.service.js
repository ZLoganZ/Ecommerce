"use strict";

const keyTokenModel = require("../models/keyToken");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens || null;

      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens?.publicKey || null;
    } catch (error) {
      throw error;
    }
  };

  static findKeyToken = async ({ userId }) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyToken = async ({ id }) => {
    return await keyTokenModel.deleteOne(id);
  };
}

module.exports = KeyTokenService;
