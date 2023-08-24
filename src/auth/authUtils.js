"use strict";

const jwt = require("jsonwebtoken");

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

module.exports = {
  createTokenPair,
};
