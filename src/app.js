require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

//init middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

//init database
require("./database/init.mongodb");

//init routes
app.use("/api", require("./routes"));

//handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  error.message = "Invalid URL";
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: message,
    stack: error.stack,
  });
});

module.exports = app;
