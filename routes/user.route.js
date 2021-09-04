
const userController = require('../controllers/user.controller.js')

module.exports = (app) => {
    app.get('/users', userController.findAll)
    app.post('/user', userController.create)
}