"use strict";

const accessController = require("../../controllers/access.controller");

const router = require("express").Router();

router.post("/shop/register", accessController.register);

module.exports = router;
