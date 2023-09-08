"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const keyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
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

  const keyStore = await keyTokenService.findByUserId({ userId });
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
    req.user = decoded;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Error: Invalid request!");
  }

  const keyStore = await keyTokenService.findByUserId({ userId });
  if (!keyStore) {
    throw new NotFoundError("Error: KeyToken not found!");
  }

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decoded = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decoded.userId) {
        throw new AuthFailureError("Error: Invalid request!");
      }
      req.keyStore = keyStore;
      req.user = decoded;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
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
    req.user = decoded;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};
