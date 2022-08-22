const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 31415;
const io = require('socket.io')(server)
const path = require('path');

app.use(express.static(path.join(__dirname + '/public')));

io.on('connection', socket => {
  console.log('A client connected');

  socket.on('chat', message => {
    console.log('From client: ', message);
    io.emit('chat', message);
  });

  socket.on('username', name => {
    console.log('New user: ', name);
    io.emit('username', name);
  });
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
})