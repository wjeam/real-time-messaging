
const userController = require('../controllers/user.controller.js')
const verifyTokenMiddleware = require('../services/auth.service').verifyTokenMiddleware
const verifyToken = require('../services/auth.service').verifyToken

module.exports = (app) => {
    app.get('/users', verifyTokenMiddleware, userController.findAll)
    app.post('/register', userController.register)
    app.post('/login', userController.login)
    app.post('/validate', verifyToken)
}