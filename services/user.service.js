
const mongoose = require('mongoose')
const User = mongoose.model('User')
const auth = require('./auth.service')

exports.findAll = async (res) => {
    await User.find({})
    .then(users => {
        console.log(users)
        res.status(200).send(users)
    })
    .catch(error => console.error(error))
}


exports.findOne = async (req, res) => {
    await User.find({ _id: req.params.id })
    .then(user => {
        console.log(user)
        res.status(200).send(user)
    })
    .catch(error => console.error(error))
}

exports.register = async (req, res) => {
    await User.find({$or: [
        {email: req.body.email},
        {username: req.body.username}
    ]})
    .then(user => {
        user = user[0]
        if (user?._id) {
            res.status(401).send('E-mail or username already exists.')
        } else {
            // TODO: Encrypt password and create account 
            res.status(200).send('allo')
        }
    })
    .catch(error => console.error(error))
}

exports.login = async (req, res) => {
 
}