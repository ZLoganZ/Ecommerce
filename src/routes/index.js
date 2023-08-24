"use strict";

const router = require("express").Router();

router.use('/v1', require('./access'))

module.exports = router;
