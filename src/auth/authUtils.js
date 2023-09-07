"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const keyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2d",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7d",
    });

    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        throw err;
      }
      console.log(`accessToken::`, decoded);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Error: Invalid request!");
  }

  const keyStore = await keyTokenService.findKeyToken({ userId });
  if (!keyStore) {
    throw new NotFoundError("Error: KeyToken not found!");
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Error: Invalid request!");
  }

  try {
    const decoded = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decoded.userId) {
      throw new AuthFailureError("Error: Invalid request!");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
