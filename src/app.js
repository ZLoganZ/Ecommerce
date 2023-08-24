require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

//init middleware
app.use(express.json({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init database
require("./database/init.mongodb");

//init routes
app.use("/api", require("./routes"));

//handle errors

module.exports = app;
