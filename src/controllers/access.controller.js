"use strict";

const { CREATED, OK } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  static login = async (req, res, next) => {
    new OK({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  static register = async (req, res, next) => {
    new CREATED({
      message: "Register successfully",
      metadata: await AccessService.register(req.body),
    }).send(res);
  };

  static logout = async (req, res, next) => {
    new OK({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  static handleRefreshToken = async (req, res, next) => {
    new OK({
      message: "Refresh token successfully",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
}

module.exports = AccessController;
