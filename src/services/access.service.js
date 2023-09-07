"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const shopService = require("./shop.service");

const Roles = {
  ADMIN: "0",
  SHOP: "1",
  WRITER: "2",
  EDITOR: "3",
};

const GenerateKeyPair = () => {
  return {
    privateKey: crypto.randomBytes(64).toString("hex"),
    publicKey: crypto.randomBytes(64).toString("hex"),
  };
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await shopService.findByEmail({ email });

    if (!foundShop) throw new BadRequestError("Error: Email is not found!");

    const isMatch = await bcrypt.compare(password, foundShop.password);

    if (!isMatch) throw new AuthFailureError("Error: Authentication failed!");

    const { privateKey, publicKey } = GenerateKeyPair();

    const userId = foundShop._id;

    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await keyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await keyTokenService.removeKeyToken({
      id: keyStore._id,
    });
  };

  static register = async ({ name, email, password }) => {
    // try {
    const holderShop = await shopService.findByEmail({ email });

    if (holderShop) {
      throw new BadRequestError("Error: Email is already in use!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newShop = await shopService.createShop({
      name,
      email,
      password: hashPassword,
      roles: Roles.SHOP,
    });

    if (newShop) {
      // create private key, public key
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const { privateKey, publicKey } = GenerateKeyPair();

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      const keyStores = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStores) {
        throw new BadRequestError("Error: Create key token failed!");
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }

    throw new BadRequestError("Error: Register failed!");
    // } catch (error) {
    //   console.log(error);
    // }
  };
}

module.exports = AccessService;
