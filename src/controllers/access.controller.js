"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  static register = async (req, res, next) => {
    try {
      console.log(`register::`, req.body);

      res.status(201).json(await AccessService.register(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AccessController;
