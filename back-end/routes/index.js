module.exports = (app) => {
  require("./user.route")(app);
  require("./conversation.route")(app);
  require("./message.route")(app);
  require("./auth.route")(app);
};
