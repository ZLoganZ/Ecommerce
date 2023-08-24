"use strict";

const mongoose = require("mongoose");

const _SECONDS = 5000;

//count connections
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection;
};

//check overload connections
const checkOverload = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = require("os").cpus().length;
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
    const maxConnections = numCores * 2;

    console.table({
      "Number of connections": numConnection,
      "Memory usage (MB)": Math.round(memoryUsage * 100 + Number.EPSILON) / 100,
      "Max connections": maxConnections,
    });

    if (numConnection > maxConnections) {
      console.log(`Overload connections detected!`);
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
