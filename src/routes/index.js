"use strict";

const { apiKey, permissions } = require("../auth/checkAuth");

const router = require("express").Router();

router.use(apiKey);
router.use(permissions("0000"));

router.use("/v1", require("./access"));
router.use("/v1", require("./product"));

module.exports = router;
