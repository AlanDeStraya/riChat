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
    let now = new Date();
    let hours = now.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let mins = now.getMinutes();
    mins = mins < 10 ? '0' + mins : mins;
    let secs = now.getSeconds();
    secs = secs < 10 ? '0' + secs : secs;
    let stamp = now.getMonth() + "/" + now.getDate() + "/" + now.getFullYear() + ' ' + hours + ":" + mins + ":" + secs;
    messages[messageIndex] = { message: msg, sender: users[socket.id], timestamp: stamp };
    messageIndex ++;
    socket.broadcast.emit('chat-message', { message: msg, msgNum: messageIndex, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
    io.emit('all-users', users);
  });
  socket.on('check-messages', () => {
    socket.emit('message-history', messages);
  });
  socket.on('typing', name => {
    socket.broadcast.emit('isTyping', name);
  });
  socket.on('notTyping', name => {
    socket.broadcast.emit('isntTyping', name);
  });
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
