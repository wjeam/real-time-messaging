const userService = require("../services/user.service");

exports.findAll = async (req, res) => {
  userService.findAll(res);
};

exports.register = async (req, res) => {
  userService.register(req, res);
};

exports.login = async (req, res) => {
  userService.login(req, res);
};
