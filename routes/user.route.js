
const userController = require('../controllers/user.controller.js')

module.exports = (app) => {
    app.get('/users', userController.findAll)
    app.get('/user/:id', userController.findOne)
    app.post('/register', userController.register)
    app.post('/login', userController.login)
}