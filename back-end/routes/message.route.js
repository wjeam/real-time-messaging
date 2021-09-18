
const messageController = require('../controllers/message.controller')

module.exports = (app) => {
    app.post('/message', messageController.sendMessage)
    app.get('/messages/:conversation_id', messageController.findMessageByConversationId)
}