const express = require('express')
const app = express()
const database = require('./database')()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const conversationService = require('./services/conversation.service')
const messageService = require('./services/message.service')
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8173'
    }
})

sockets = []

io.on('connection', (socket) => {
    console.log('Connected')

    user_id = socket.request._query['user_id']

    handleConnection(socket, user_id)

    socket.on("message", (data) => {
        message = messageService.createMessage(data)
        .then((message) => {
            conversationService.findUsersFromConversationId(data.conversation_id)
            .then((result) => {
                users = result[0].users
                users.forEach((user) => {
                    sockets.forEach((socket) => {
                        if(socket.user_id == user._id){
                            io.to(socket.socket_id).emit("message", message)
                        }
                    })
                })
            })
        })
    })

    socket.on('disconnect', () => {
        handleDisconnect(socket)
    })
    console.log(sockets)
})

const handleDisconnect = (socket) => {
    console.log('Disconnected')
    sockets.forEach((connection, index) => {
        if(connection.socket_id === socket.id)
            sockets.splice(index, 1)
    })
}

const handleConnection = (socket, user_id) => {
    let exists = false
    
    sockets.every((connection) => {
        if(connection.user_id === user_id) 
            exists = true
    })

    if (!exists)
        sockets.push({user_id: user_id, socket_id: socket.id})
}

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:8173',
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
require('./routes')(app)

server.listen(8172, () => {
    console.log('Server running on port 8172.')
})