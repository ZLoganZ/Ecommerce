"use strict";

const ProductServices = require("../services/product.service");
const { OK } = require("../core/success.response");

class ProductController {
  static createProduct = async (req, res, next) => {
    new OK({
      message: "Product created successfully",
      metadata: await ProductServices.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static publishProductByShop = async (req, res, next) => {
    new OK({
      message: "Product published successfully",
      metadata: await ProductServices.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  static unPublishProductByShop = async (req, res, next) => {
    new OK({
      message: "Product unpublished successfully",
      metadata: await ProductServices.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  static findAllDraftProductsForShop = async (req, res, next) => {
    new OK({
      message: "All draft products for shop fetched successfully",
      metadata: await ProductServices.findAllDraftProductsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static findAllPublishedProductsForShop = async (req, res, next) => {
    new OK({
      message: "All published products for shop fetched successfully",
      metadata: await ProductServices.findAllPublishedProductsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  static searchProducts = async (req, res, next) => {
    new OK({
      message: "All products searched successfully",
      metadata: await ProductServices.searchProducts({
        keySearch: req.query.keySearch,
      }),
    }).send(res);
  };

  static findAllProducts = async (req, res, next) => {
    new OK({
      message: "All products fetched successfully",
      metadata: await ProductServices.findAllProducts({
        limit: req.query.limit,
        sort: req.query.sort,
        page: req.query.page,
        filter: req.query.filter,
      }),
    }).send(res);
  };

  static findProduct = async (req, res, next) => {
    new OK({
      message: "Product fetched successfully",
      metadata: await ProductServices.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = ProductController;
