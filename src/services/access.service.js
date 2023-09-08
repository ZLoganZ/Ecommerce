"use strict";

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
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
    return await keyTokenService.removeById({
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

  static handleRefreshToken = async ({ refreshToken, keyStore, user }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await keyTokenService.removeByUserId({ userId });
      throw new ForbiddenError(
        "Error: Something went wrong!! Please login again!"
      );
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Error: Authentication failed!");
    }

    const foundShop = await shopService.findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Error: Authentication failed!");
    }

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };

    // const foundKeyStore = await keyTokenService.findByRefreshTokenUsed({
    //   refreshToken,
    // });
    // if (foundKeyStore) {
    //   const { userId, email } = await verifyJWT(
    //     refreshToken,
    //     foundKeyStore.privateKey
    //   );

    //   console.log(`userId[1]:`, userId, email);

    //   await keyTokenService.removeByUserId({ userId });

    //   throw new ForbiddenError(
    //     "Error: Something went wrong!! Please login again!"
    //   );
    // }

    // const keyStore = await keyTokenService.findByRefreshToken({ refreshToken });
    // if (!keyStore) {
    //   throw new AuthFailureError("Error: Authentication failed!");
    // }

    // const { userId, email } = await verifyJWT(
    //   refreshToken,
    //   keyStore.privateKey
    // );

    // console.log(`userId[2]:`, userId, email);

    // const foundShop = await shopService.findByEmail({ email });
    // if (!foundShop) {
    //   throw new AuthFailureError("Error: Authentication failed!");
    // }

    // const tokens = await createTokenPair(
    //   { userId, email },
    //   keyStore.publicKey,
    //   keyStore.privateKey
    // );

    // await keyStore.updateOne({
    //   $set: {
    //     refreshToken: tokens.refreshToken,
    //   },
    //   $addToSet: {
    //     refreshTokenUsed: refreshToken,
    //   },
    // });

    // return {
    //   shop: getInfoData({
    //     fields: ["_id", "name", "email"],
    //     object: foundShop,
    //   }),
    // };
  };
}

module.exports = AccessService;
