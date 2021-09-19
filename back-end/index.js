const express = require('express')
const app = express()
const database = require('./database')()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const messageService = require('./services/message.service')

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

sockets = {}

io.on('connection', (socket) => {
    console.log('CONNECTED')

    user_id = socket.request._query['user_id']
    conversation_id = socket.request._query['conversation_id']

    console.log(sockets)
    socket.on('message', (message) => {
        messageService.createMessage({user_id: message.user_id, conversation_id: message.conversation_id, content: message.content})
            .then((a) => io.emit("message", a))
            .catch((err) => console.error(err))
        }        
    )   
    
    socket.on('disconnect', () => {
        console.log('DISCONNECTED')
    })
})

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
require('./routes')(app)

server.listen(3030, () => {
    console.log('Server running on port 3030.')
})