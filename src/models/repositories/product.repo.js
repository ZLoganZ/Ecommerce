"use strict";

const { BadRequestError } = require("../../core/error.response");
const { product, clothe, electronic, furniture } = require("../product.model");

class ProductRepository {
  static async queryAllProductsForShop({ query, limit, skip }) {
    return await product
      .find(query)
      .populate("product_shop", "name email -_id")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  static async publishProductByShop({ product_shop, product_id }) {
    const foundShop = await product.findOne({
      product_shop,
      _id: product_id,
    });

    if (!foundShop) {
      throw new BadRequestError("Error: Invalid product id!");
    }

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    const foundShop = await product.findOne({
      product_shop,
      _id: product_id,
    });

    if (!foundShop) {
      throw new BadRequestError("Error: Invalid product id!");
    }

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
  }

  static async searchProduct({ keySearch }) {
    const regexSearch = new RegExp(keySearch, "i");
    const result = await product
      .find(
        {
          isPublished: true,
          $text: { $search: regexSearch },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    return result;
  }
}

module.exports = ProductRepository;
