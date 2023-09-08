"use strict";

const { authenticationV2 } = require("../../auth/authUtils");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

//sign up
router.post("/shop/register", asyncHandler(accessController.register));

//sign in
router.post("/shop/login", asyncHandler(accessController.login));

//authentication
router.use(authenticationV2);

//sign out
router.post("/shop/logout", asyncHandler(accessController.logout));

//handle refresh token
router.post(
  "/shop/handle-refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
