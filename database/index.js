const mongoose = require('mongoose')
const models = require('../models')(mongoose)

require('dotenv').config()

module.exports = () => {
    const connection = mongoose.connect(process.env.DATABASE_URL)
    return connection.connection.db
}

