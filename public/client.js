const socket = io();
const chatWindow = document.getElementById('chat-window');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const checkMessagesButton = document.getElementById('chat-label');
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
checkMessagesButton.addEventListener('click', checkMessages);

function renderMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('render-message');
  msgDiv.innerText = message;
  chatWindow.appendChild(msgDiv);
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

function checkMessages() {
  socket.emit('check-messages');
};

socket.on('message-history', obj => {
  let msgHist = ''
  for (let m in obj) {
    msgHist += `${obj[m].sender}: ${obj[m].message} at ${obj[m].timestamp}\n`;
  }
  chatWindow.innerText = msgHist;
});