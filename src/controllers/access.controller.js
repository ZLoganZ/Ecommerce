"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  static register = async (req, res, next) => {
    res.status(201).json(await AccessService.register(req.body));
  };
}

module.exports = AccessController;
