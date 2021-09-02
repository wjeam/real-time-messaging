
const express = require('express')
const app = express()
const database = require('./database')
require('./routes')(app)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(3030, () => {
    console.log('Server running on port 3030.')
})