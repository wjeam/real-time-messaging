
const mongoose = require('mongoose')
const Message = mongoose.model('Message')
const { addMessage } = require('./conversation.service')

exports.createMessage = async (req, res) => {
    const message = req.body
    Message.create(message)
    .then((message) => {
        const obj = {
            message_id: message._id,
            conversation_id: message.conversation_id
        }
        addMessage(obj)
        .then((what) => {
            console.log(what)
            res.status(200).send('Message created.')
        })
        .catch((error) => {
            console.error(error)
            res.status(400).send('Message problem.')
        })
    })
}