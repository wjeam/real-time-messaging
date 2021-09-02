
module.exports = (app) => {
    require('./user_route')(app)
    require('./conversation_route')(app)
    require('./message_route')(app)
}