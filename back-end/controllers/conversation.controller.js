const conversationService = require("../services/conversation.service");

exports.createConversation = async (req, res) => {
  conversationService.createConversation(req, res);
};

exports.insertUser = async (req, res) => {
  conversationService.insertUser(req, res);
};

exports.findConversationsByUserId = async (req, res) => {
  conversationService.findConversationsByUserId(req, res);
};

exports.leave = async (req, res) => {
  conversationService.deleteUserByConversationId(req, res);
};

exports.clearConversation = async (req, res) => {
  conversationService.deleteAllMessagesById(req, res);
};

exports.updateConversation = async (req, res) => {
  conversationService.updateConversationTitleById(req, res);
};
