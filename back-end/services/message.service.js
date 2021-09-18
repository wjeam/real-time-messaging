
const mongoose = require('mongoose')
const Message = mongoose.model('Message')
const { insertMessage } = require('./conversation.service')

exports.createMessage = async (req, res) => {
    const message = req.body
    Message.create(message)
    .then((message) => {
        message = {
            message_id: message._id, 
            conversation_id: message.conversation_id 
        }
        insertMessage(message)
        .then(() => {
            res.status(200)
        })
        .catch((error) => {
            console.error(error)
            res.status(400)
        })
    })
}