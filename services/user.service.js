
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.findAll = (res) => {
    User.find({})
    .then(users => {
        console.log(users)
        res.status(200).send(users)
    })
    .catch(error => console.error(error))
}

exports.create = (req, res) => {
    User.create(req.body)
    .then(user => {
        console.log(user)
        res.status(200).send(user)
    })
    .catch(error => console.error(error))
}