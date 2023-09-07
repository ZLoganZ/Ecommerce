"use strict";

const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");

const router = require("express").Router();

router.post("/shop/register", asyncHandler(accessController.register));

module.exports = router;
