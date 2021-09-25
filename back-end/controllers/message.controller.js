const messageService = require("../services/message.service");

exports.findMessageByConversationId = async (req, res) => {
  messageService.findMessagesByConversationId(req, res);
};
