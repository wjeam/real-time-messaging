const userController = require("../controllers/user.controller.js");
const verifyTokenMiddleware =
  require("../services/auth.service").verifyTokenMiddleware;

module.exports = (app) => {
  app.get("/users", userController.findAll);
  app.post("/register", userController.register);
  app.post("/login", userController.login);
};
