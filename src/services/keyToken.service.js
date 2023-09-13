"use strict";

const keyTokenModel = require("../models/keyToken.model");

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

  static findByUserId = async ({ userId }) => {
    return await keyTokenModel.findOne({ user: userId });
  };

  static findByRefreshTokenUsed = async ({ refreshToken }) => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async ({ refreshToken }) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static removeById = async ({ id }) => {
    return await keyTokenModel.deleteOne(id);
  };

  static removeByUserId = async ({ userId }) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
}

module.exports = KeyTokenService;
