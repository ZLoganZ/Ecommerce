"use strict";

const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// search products
router.get("/product/search", asyncHandler(productController.searchProducts));

// get all products
router.get("/product", asyncHandler(productController.findAllProducts));

// get a product
router.get("/product/:product_id", asyncHandler(productController.findProduct));

// use authentication middleware
router.use(authenticationV2);

// create a new product
router.post("/product", asyncHandler(productController.createProduct));

// publish a product
router.patch(
  "/product/publish/:product_id",
  asyncHandler(productController.publishProductByShop)
);

// unpublish a product
router.patch(
  "/product/unpublish/:product_id",
  asyncHandler(productController.unPublishProductByShop)
);

// get all draft products for a shop
router.get(
  "/product/draft/all",
  asyncHandler(productController.findAllDraftProductsForShop)
);

// get all published products for a shop
router.get(
  "/product/published/all",
  asyncHandler(productController.findAllPublishedProductsForShop)
);

module.exports = router;
