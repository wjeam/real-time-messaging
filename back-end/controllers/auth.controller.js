const authService = require("../services/auth.service");

exports.verifyToken = async (req, res) => {
  authService.verifyToken(req, res);
};
