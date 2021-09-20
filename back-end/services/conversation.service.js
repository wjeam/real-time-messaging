
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

exports.findUsersFromConversationId = async (conversation_id) => {
    return Conversation.find(
        { _id: conversation_id }
    )
    .populate({
        "path" : "users",
        "select": "-password -email -__v -creation_date -profile_image -username"
    })
    .select('-messages -creation_date -password -title -__v -_id')
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
    .catch((error) => {console.error(error)})
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
            path: 'user_id',
            select: '-password'
        }
    })
    .then((result) => {
        res.status(200).send(result)
    })
    .catch((error) => {
        console.error(error)
        res.status(400).send('')
    })
}

