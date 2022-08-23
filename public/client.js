const socket = io();
const chatWindow = document.getElementById('chat-window');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const checkUserButton = document.getElementById('check-users');
const userList = document.getElementById('user-list');
let list;
const username = prompt('Enter your username');
renderMessage('You joined');
socket.emit('new-user', username);
if(username === 'Pookie') {
  renderMessage('Pookie-detection-bot: I love you SMASM');
} else if(username === 'Riana') {
  renderMessage('Riana-detection-bot: You are the love of my life');
}

chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const message = chatInput.value;
  renderMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  chatInput.value = '';
});

checkUserButton.addEventListener('click', checkUsers);

function renderMessage(message) {
  const div = document.createElement('div');
  div.classList.add('render-message');
  div.innerText = message;
  chatWindow.appendChild(div);
  scrollToBottom();
};
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

socket.on('user-connected', username => {
  renderMessage(`${username} connected`)
});

socket.on('all-users', users => {
  userList.innerText = listOnlineUsers(users);
});

socket.on('chat-message', data => {
  renderMessage(`${data.name}: ${data.message} [${data.msgNum}]`)
});

socket.on('user-disconnected', username => {
  renderMessage(`${username} disconnected`)
});


function listOnlineUsers(object) {
  let str = '\n >> Users online: \n';
  for (let user in object) {
    if (object.hasOwnProperty(user)) {
      str += '>> ' + object[user] + '\n';
    }
  }
  str += '\n' + ' ';
  return str;
};

function checkUsers(str) {
  if(!list) {
    userList.style.display = 'block';
    list = true;
  } else if(list) {
    userList.style.display = 'none';
    list = false;
  }
};

socket.on('user-list', list => {
});