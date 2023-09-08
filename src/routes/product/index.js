"use strict";

const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// use authentication middleware
router.use(authenticationV2);

// create a new product
router.post("/product", asyncHandler(productController.createProduct));

module.exports = router;
