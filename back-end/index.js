const express = require("express");
const app = express();
const database = require("./database")();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const conversationService = require("./services/conversation.service");
const messageService = require("./services/message.service");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8173",
  },
});

sockets = [];
const systemId = "";

io.on("connection", (socket) => {
  const user_id = socket.request._query["user_id"];

  console.log("New connection { " + user_id + " }");

  handleConnection(socket, user_id);

  socket.on("message", (data) => {
    message = messageService.createMessage(data).then((message) => {
      conversationService
        .findUsersByConversationId(data.conversation_id)
        .then((result) => {
          users = result[0].users;
          broadcastMessage(users, message, "message");
        });
    });
  });

  socket.on("logout", (data) => {
    handleDisconnect(socket, data.user_id);
  });

  socket.on("add_conversation", (data) => {
    conversationService
      .findConversationById(data.conversation_id)
      .then((conversation) => {
        sockets.every((socket) => {
          if (socket.user_id === data.user_id) {
            io.to(socket.socket_id).emit("add_conversation", conversation);
            notifyUsers({
              content: data.identifier + " joined the conversation",
              conversation_id: data.conversation_id,
            });
            return false;
          }
          return true;
        });
      });
  });

  socket.on("clear_conversation", (data) => {
    conversationService
      .findConversationById(data.conversation_id)
      .then((conversation) => {
        broadcastMessage(
          conversation.users,
          { conversation_id: conversation._id },
          "clear_conversation"
        );
        notifyUsers({
          content: "Conversation cleared",
          conversation_id: conversation._id,
        });
      });
  });

  socket.on("leave_conversation", (data) => {
    const message = {
      content: data.username + " left the conversation",
      conversation_id: data.conversation_id,
    };

    notifyUsers(message);
  });

  socket.on("change_title_conversation", (data) => {
    const message = {
      content: "Conversation title changed to: " + data.title,
      conversation_id: data.conversation_id,
    };
    conversationService
      .findUsersByConversationId(data.conversation_id)
      .then((users) => {
        broadcastMessage(users[0].users, data, "change_title_conversation");
      });

    notifyUsers(message);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });
  console.log(sockets);
});

const handleDisconnect = (socket) => {
  if (sockets.length === 0) return;
  console.log("Disconnected { " + socket.id + " }");
  sockets.every((connection, index) => {
    if (connection.socket_id === socket.id) {
      sockets.splice(index, 1);
      return false;
    } else return true;
  });
};

const notifyUsers = (message) => {
  messageService
    .createMessage({
      user_id: systemId,
      content: message.content,
      conversation_id: message.conversation_id,
    })
    .then((message) => {
      conversationService
        .findUsersByConversationId(message.conversation_id)
        .then((users) => {
          broadcastMessage(users[0].users, message, "message");
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
};

const broadcastMessage = (users, content, callback) => {
  if (!users || users.length === 0) return;
  users.forEach((user) => {
    sockets.forEach((socket) => {
      if (socket.user_id == user._id) {
        io.to(socket.socket_id).emit(callback, content);
      }
    });
  });
};

const handleConnection = (socket, user_id) => {
  let exists = false;

  sockets.every((connection) => {
    if (connection.user_id === user_id) exists = true;
  });

  if (!exists) sockets.push({ user_id: user_id, socket_id: socket.id });
};

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./routes")(app);

server.listen(8172, () => {
  console.log("Server running on port 8172.");
});
