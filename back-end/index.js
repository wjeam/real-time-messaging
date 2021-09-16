const express = require('express')
const app = express()
const database = require('./database')()
const cors = require('cors')
const cookieParser = require('cookie-parser')

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (stream) => {
    console.log('connected!')
})

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
require('./routes')(app)

server.listen(3030, () => {
    console.log('Server running on port 3030.')
})