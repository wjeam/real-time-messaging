
const mongoose = require('mongoose')
const message = require('../models/message')
const Conversation = mongoose.model('Conversation')

exports.createConversation = async (req, res) => {
    const conversation = req.body
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
    const dto = req.body
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
    Conversation.findOneAndUpdate(
        { _id: message.conversation_id },
        { $push: { messages: message.message_id } }
    )
}

exports.findConversationsByUserId = async (req, res) => {
    const user_id = req.params.user_id
    
    Conversation.find(
        {users: {$in: [user_id]}}
    )
    .select('-users')
    .populate({
        path: 'messages',
        populate: {
            path: 'user_id'
        }
    })
    .then((result) => {
        result.forEach((conversation) => {
            conversation.messages.forEach((message) => {
                message.user_id = cleanUser(message.user_id)
            })
        })
        res.status(200).send(result)
    })
    .catch((error) => {
        console.error(error)
        res.status(400).send('')
    })
}

function cleanUser(user) {
    user.password = undefined
    user.email = undefined
    user.creation_date = undefined
    return user
}
