const mongoose = require("mongoose");
const models = require("../models")(mongoose);

require("dotenv").config();

const connection = mongoose.connect(process.env.DATABASE_URL);

module.exports = () => {
  return connection.connection;
};
