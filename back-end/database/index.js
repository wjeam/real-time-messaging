const mongoose = require("mongoose");
const models = require("../models")(mongoose);
const bcrypt = require("bcrypt");

require("dotenv").config();

const connection = mongoose.connect(process.env.DATABASE_URL);

module.exports = () => {
  return connection.connection;
};
