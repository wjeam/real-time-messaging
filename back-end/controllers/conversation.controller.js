
const conversationService = require('../services/conversation.service')

exports.createConversation = async (req, res) => {
    conversationService.createConversation(req, res)
}

exports.insertUser = async(req, res) => {
    conversationService.insertUser(req, res)
}
