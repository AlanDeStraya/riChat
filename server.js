const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 31415;
const io = require('socket.io')(server)
const path = require('path');

app.use(express.static(path.join(__dirname + '/public')));

const users = {};
const messages = {};
let messageIndex = 0;

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    io.emit('all-users', users);
  });
  socket.on('send-chat-message', msg => {
    messages[messageIndex] = msg;
    messageIndex ++;
    socket.broadcast.emit('chat-message', { message: msg, msgNum: messageIndex, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
    io.emit('all-users', users);
  });
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})