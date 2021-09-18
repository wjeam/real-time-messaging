
const mongoose = require('mongoose')
const message = require('../models/message')
const Conversation = mongoose.model('Conversation')

exports.createConversation = async (req, res) => {
    conversation = req.body
    Conversation.create(conversation)
    .then(() => {
        res.status(200)
    })
    .catch((error) => {
        console.error(error)
        res.status(400)
    })
}

exports.insertUser = async (req, res) => {
    obj = req.body
    Conversation.updateOne(
        { _id: obj.conversation_id },
        { $addToSet: {users: obj.user_id}}
    )
    .then(() => {
        res.status(200)
    })
    .catch((error) => {
        console.error(error)
        res.status(400)
    })
}

exports.insertMessage = async (message) => {
    return Conversation.updateOne(
        { _id: message.conversation_id },
        { $push: { messages: message.message_id } }
    )
}


exports.findConversationsByUserId = async (req, res) => {
    // TBI
}

