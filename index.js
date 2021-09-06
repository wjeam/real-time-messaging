const express = require('express')
const app = express()
const database = require('./database')()
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    exposedHeaders: ['set-cookie']
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
require('./routes')(app)

app.listen(3030, () => {
    console.log('Server running on port 3030.')
})