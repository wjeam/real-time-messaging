
const messageService = require('../services/message.service')

exports.sendMessage = async(req, res) => {
    messageService.createMessage(req, res)
}