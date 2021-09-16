
const conversationController = require('../controllers/conversation.controller')

module.exports = (app) => {
    app.post('/conversation', conversationController.createConversation)
    app.post('/conversation/user', conversationController.addUser)
}