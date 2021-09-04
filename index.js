const express = require('express')
const app = express()
const database = require('./database')()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

require('./routes')(app)

app.listen(3030, () => {
    console.log('Server running on port 3030.')
})