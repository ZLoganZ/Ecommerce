"use strict";

const mongoose = require("mongoose");

const { MONGO_URI } = require("../configs/database.config");

class Database {
  constructor() {
    this._connect();
  }

  //connect to database
  _connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(MONGO_URI)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
        console.error(err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instance = Database.getInstance();

module.exports = instance;
