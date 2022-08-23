const socket = io();
const chatWindow = document.getElementById('chat-window');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const username = prompt('Enter your username');
renderMessage('You joined');
socket.emit('new-user', username);

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const message = chatInput.value;
  renderMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  chatInput.value = '';
});

function renderMessage(message) {
  const div = document.createElement('div');
  div.classList.add('render-message');
  div.innerText = message;
  chatWindow.appendChild(div);
};

socket.on('user-connected', username => {
  renderMessage(`${username} connected`)
});

socket.on('all-users', users => {
  const userString = objToString(users);
  renderMessage(userString);
});

socket.on('chat-message', data => {
  renderMessage(`${data.name}: ${data.message}`)
});

socket.on('user-disconnected', username => {
  renderMessage(`${username} disconnected`)
});


function objToString(object) {
  let str = '';
  for (let user in object) {
    if (object.hasOwnProperty(user)) {
      str += user + ': ' + object[user] + '\n';
    }
  }
  return str;
};