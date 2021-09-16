
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.encryptPassword = async (password) => {
    return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
}

exports.validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

exports.verifyTokenMiddleware = async(req, res, next) => {
    const token = req.cookies.access_token
    try { 
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch(error) {
        res.status(400).send('ACCESS DENIED')
    }
}

exports.verifyToken = async(req, res) => {
    try {
        const verify = jwt.verify(req.body.access_token, process.env.JWT_SECRET)
        res.send(true)
    } catch(error) {
        res.send(false)
    }
}

exports.signToken = async (res, _id, email) => {
    const token = jwt.sign({_id, email}, process.env.JWT_SECRET, {expiresIn: 3600})
    res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 15,
        httpOnly: false,
        sameSite: true
    })
    res.send('Welcome, ' + email)
}