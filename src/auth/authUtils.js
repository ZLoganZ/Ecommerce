"use strict";

const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2d",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    jwt.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        throw err;
      }
      console.log(`decoded::`, decoded);
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTokenPair,
};
