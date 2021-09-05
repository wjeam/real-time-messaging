
const bcrypt = require('bcrypt')
require('dotenv').config()

exports.encryptPassword = async (password) => {
    return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
}