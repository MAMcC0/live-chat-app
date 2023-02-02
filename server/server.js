const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config()

const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001
const conversationRoutes = require('./routes/conversationRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messageRoute');
const socket = require('socket.io');

//Mongoose connection
const connection = require("./config/connection");

//Auth middleware
const auth = require('./utils/auth');

app.use(cors())
app.use(express.json());


//routes
app.use('/api/user', auth, userRoutes);
app.use('/api/conversation', auth, conversationRoutes);
app.use('api/messages', auth, messageRoute);

const start = () => {
  try {
    if(connection){
      connection.once('open', ()=> {
        app.listen(PORT, ()=> {
          console.log(`API server running on port ${PORT}`)
        })
      })
    };

  } catch (error){
    console.log(error);
  }
};

start();

//est socket web socket connection to server
const io = socket(server, {
  cors:{
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId)=>{
    onlineUsers.set(userId,socket.id);
  });

  socket.on('send-message', (data) => {
    const sendUserInfo = onlineUsers.get(data.to);
      if(sendUserInfo){
        socket.to(sendUserInfo).emit("message-delivered", data.message);
      }
  });
});