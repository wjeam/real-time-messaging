const messageController = require("../controllers/message.controller");

module.exports = (app) => {
  app.get(
    "/messages/:conversation_id",
    messageController.findMessageByConversationId
  );
};
