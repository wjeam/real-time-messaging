const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.encryptPassword = async (password) => {
  return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
};

exports.validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

exports.verifyTokenMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).send("You don't have access to this content");
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const verify = jwt.verify(req.cookies.access_token, process.env.JWT_SECRET);
    res.status(200).send(true);
  } catch (error) {
    res.status(200).send(false);
  }
};

exports.signToken = async (res, _id, email, username) => {
  const token = jwt.sign({ _id, email, username }, process.env.JWT_SECRET, {
    expiresIn: 1000,
  });
  res.cookie("access_token", token, {
    maxAge: 1000000,
    httpOnly: false,
    sameSite: true,
  });
  res.status(200).send("");
};
