
const mongoose = require('mongoose')
const User = mongoose.model('User')
const auth = require('./auth.service')

exports.findAll = async (res) => {
    User.find({})
    .then(users => {
        console.log(users)
        res.status(200).send(users)
    })
    .catch(error => console.error(error))
}

exports.findOne = async (req, res) => {
    User.find({ _id: req.params.id })
    .then(user => {
        console.log(user)
        res.status(200).send(user)
    })
    .catch(error => console.error(error))
}

exports.register = async (req, res) => {
    User.find({$or: [
        {email: req.body.email},
        {username: req.body.username}
    ]})
    .then((user) => {
        user = user[0] || req.body
        if (user?._id) {
            res.status(401).send('E-mail or username already exists.')
        } else {
            auth.encryptPassword(user.password)
            .then((hash) => {
                user.password = hash
                createAccount(res, user)
            })
            .catch((error) => console.error(error))
        }
    })
    .catch(error => console.error(error))
}

async function createAccount(res, user) {
    User.create(user)
    .then(() => {
        res.status(200).send('Account created')
    })
    .catch((error) => console.error(error))
}

exports.login = async (req, res) => {
    User.find({$or: [
        {email: req.body.identifier},
        {username: req.body.identifier}
    ]})
    .then((user) => {
        if (user[0]) {
            auth.validatePassword(req.body.password, user[0].password)
            .then((isValid) => {
                if(isValid) {
                    console.log('Welcome, ' + user[0].username)
                    auth.signToken(res, user[0]._id, user[0]._email)
                } else {
                    console.log('Password incorrect')
                    res.status(200).end()
                }
            })
            .catch((error) => console.log(error))
        } else {
            res.status(200).send('Account not found')
        }
    })
    .catch((error) => console.log(error))
}