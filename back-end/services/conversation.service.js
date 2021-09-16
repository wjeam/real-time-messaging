
const mongoose = require('mongoose')
const message = require('../models/message')
const Conversation = mongoose.model('Conversation')

exports.createConversation = async (req, res) => {
    conversation = req.body
    Conversation.create(conversation)
    .then((conversation) => {
        console.log(conversation)
        res.status(200).send('Conversation created!')
    })
    .catch((error) => {
        console.error(error)
        res.status(400).send('Conversation error.')
    })
}

exports.addUser = async (req, res) => {
    obj = req.body
    Conversation.updateOne(
        { _id: obj.conversation_id },
        { $addToSet: {users: obj.user_id}}
    )
    .then((conversation) => {
        console.log(conversation)
        res.status(200).send('Conversation updated.')
    })
    .catch((error) => {
        console.error(error)
        res.status(400).send('Conversation update problem.')
    })
}

exports.addMessage = async (message) => {
    return Conversation.updateOne(
        { _id: message.conversation_id },
        { $push: { messages: message.message_id } }
    )
    .catch((error) => {
        console.error(error)
    })
}


