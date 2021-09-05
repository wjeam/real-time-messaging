
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.encryptPassword = async (password) => {
    return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
}

exports.validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

exports.verifyToken = async(req, res, next) => {
    const token = req.cookies.access_token
    console.log(token)
    try { 
        const verify = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch(error) {
        res.status(400).send('ACCESS DENIED')
    }
}

exports.signToken = async (res, _id, email) => {
    const token = jwt.sign({_id, email}, process.env.JWT_SECRET)
    res.cookie('access_token', token, {
        maxAge: 600,
        httpOnly: true
    })
    res.status(200).end()
}