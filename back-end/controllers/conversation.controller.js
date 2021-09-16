
const conversationService = require('../services/conversation.service')

exports.createConversation = async (req, res) => {
    conversationService.createConversation(req, res)
}

exports.addUser = async(req, res) => {
    conversationService.addUser(req, res)
}
