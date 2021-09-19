
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

    message = await message.populate('user_id')
    message.user_id.creation_date = undefined
    message.user_id.password = undefined
    return message
}

exports.findMessagesByConversationId = async(req, res) => {
    const conversation_id = req.params.conversation_id
    Message.find(
        {
            conversation_id: conversation_id
        }
    )
    .populate('user_id')
    .then((messages) => {
        messages.forEach(message => {
            message.user_id.password = undefined
            message.user_id.creation_date = undefined
        })
        res.status(200).send(messages)
    })
    .catch((error) => {
        console.error(error)
    })
}
