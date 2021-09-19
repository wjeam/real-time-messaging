
const messageService = require('../services/message.service')

exports.findMessageByConversationId = async(req, res) => {
    messageService.findMessagesByConversationId(req, res)
}

exports.createMessage = async(req, res) => {
    messageService.test(req, res)
}