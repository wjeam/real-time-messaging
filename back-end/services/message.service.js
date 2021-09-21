
const mongoose = require('mongoose')
const Message = mongoose.model('Message')
const { insertMessage } = require('./conversation.service')

exports.createMessage = async (data) => {
    let message = await Message.create(data)
    .then((newMessage) => {
        data = {
            message_id: newMessage._id, 
            conversation_id: newMessage.conversation_id 
        }
        
        insertMessage(data)

        return newMessage
    })

    return await message.populate({
        path: 'user_id',
        select: '-password'
    })
}

exports.findMessagesByConversationId = async(req, res) => {
    const conversation_id = req.params.conversation_id
    Message.find(
        {
            conversation_id: conversation_id
        }
    )
    .populate({
        path: 'user_id',
        select: '-password'
    })
    .then((messages) => {
        res.status(200).send(messages)
    })
    .catch((error) => {
        console.error(error)
        res.status(400).send('')
    })
}
