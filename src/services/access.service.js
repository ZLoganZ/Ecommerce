"use strict";

const shopModel = require("../models/shop");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const Roles = {
  ADMIN: "0",
  SHOP: "1",
  WRITER: "2",
  EDITOR: "3",
};

class AccessService {
  static register = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: 400,
          metadata: {
            message: "Email already exists",
          },
        };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [Roles.SHOP],
      });

      if (newShop) {
        // create private key, public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log(privateKey);
        console.log(publicKey);

        const publicKeyString = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: 400,
            metadata: {
              message: "Create key token failed",
            },
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 400,
        metadata: {
          message: "Create shop failed",
        },
      };
    } catch (error) {}
  };
}

module.exports = AccessService;
