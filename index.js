const express = require('express')
const app = express()
const database = require('./database')()
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3030'
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

require('./routes')(app)

app.listen(3030, () => {
    console.log('Server running on port 3030.')
})