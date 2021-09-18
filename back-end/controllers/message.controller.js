
const messageService = require('../services/message.service')

exports.sendMessage = async(req, res) => {
    messageService.createMessage(req, res)
}

exports.findMessageByConversationId = async(req, res) => {
    messageService.findMessagesByConversationId(req, res)
}