const authController = require("../controllers/auth.controller");

module.exports = (app) => {
  app.get("/auth/verifyToken", authController.verifyToken);
};
