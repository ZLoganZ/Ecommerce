"use strict";

const shopModel = require("../models/shop");

class ShopService {
  static findByEmail = async ({
    email,
    select = {
      email: 1,
      password: 2,
      roles: 1,
      status: 1,
      name: 1,
    },
  }) => {
    return await shopModel.findOne({ email }).select(select).lean();
  };

  static createShop = async ({ name, email, password, roles }) => {
    return await shopModel.create({
      name,
      email,
      password,
      roles,
    });
  };
}

module.exports = ShopService;
