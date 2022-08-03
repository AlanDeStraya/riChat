const socket = io();
const chat = document.querySelector('.chat-form');
const Input = document.querySelector('.chat-input');
const chatWindow = document.querySelector('.chat-window');
const username = prompt('What is your username?');

chat.addEventListener('submit', event => {
  event.preventDefault();
  socket.emit('chat', username + ': ' + Input.value);
  Input.value = '';
});

const renderMessage = message => {
  const div = document.createElement('div');
  div.classList.add('render-message');
  div.innerText = message;
  chatWindow.appendChild(div);
};

socket.on('chat', message => {
  renderMessage(message);
});