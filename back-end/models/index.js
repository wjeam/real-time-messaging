
module.exports = (mongoose) => {
    User = require('./user')(mongoose)
    Conversation = require('./conversation')(mongoose)
    Message = require('./message')(mongoose)

    const models = {
        User: mongoose.model('User', User),
        Message: mongoose.model('Message', Message),
        Conversation: mongoose.model('Conversation', Conversation)
    }

    return models
}