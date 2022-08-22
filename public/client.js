const socket = io();
const chatWindow = document.querySelector('#chat-window');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const nameForm = document.querySelector('#name-form');
const nameInput = document.querySelector('#name-input');
let username;

nameForm.addEventListener('submit', event => {
  event.preventDefault();
  username = nameInput.value;
  socket.emit('username', '>> ' + username + ' is online');
  nameInput.value = ''; 
});

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  socket.emit('chat', username + ': ' + chatInput.value);
  chatInput.value = '';
});

const renderMessage = message => {
  const div = document.createElement('div');
  div.classList.add('render-message');
  div.innerText = message;
  chatWindow.appendChild(div);
};

const handleNewUser = name => {
  const div = document.createElement('div');
  div.classList.add('render-message');
  div.innerText = name;
  chatWindow.appendChild(div);
  //post in list of users
};

socket.on('chat', message => {
  renderMessage(message);
});

socket.on('username', name => {
  handleNewUser(name);
});