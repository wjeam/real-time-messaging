
const userController = require('../controllers/user.controller.js')
const authentication = require('../services/auth.service').verifyToken

module.exports = (app) => {
    app.get('/users', authentication, userController.findAll)
    app.post('/register', userController.register)
    app.post('/login', userController.login)
}