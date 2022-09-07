const socket = io();
const chatWindow = document.getElementById('chat-window');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const checkMessagesButton = document.getElementById('chat-label');
const checkUserButton = document.getElementById('check-users');
const userList = document.getElementById('user-list');
let list;
let typing = false;
let timer;
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

chatInput.addEventListener('keypress', e => {
  if(typing) {
    clearTimeout(timer);
    timer = setTimeout(stopTyping, 7000);
  } else {
    typing = true;
    socket.emit('typing', username);
    let timer = setTimeout(stopTyping, 7000);
  }
});

function stopTyping() {
  typing = false;
  socket.emit('notTyping', username);
};

checkUserButton.addEventListener('click', checkUsers);
checkMessagesButton.addEventListener('click', checkMessages);


socket.on('user-connected', username => {
  renderMessage(`${username} connected`);
});

socket.on('all-users', users => {
  userList.innerText = listOnlineUsers(users);
});

socket.on('chat-message', data => {
  renderMessage(`${data.name}: ${data.message}`);
});

socket.on('user-disconnected', username => {
  renderMessage(`${username} disconnected`);
});

socket.on('message-history', obj => {
  let msgHist = ''
  for (let m in obj) {
    msgHist += `${obj[m].sender}: ${obj[m].message} at ${obj[m].timestamp}\n`;
  }
  chatWindow.innerText = msgHist;
});

socket.on('isTyping', name => {
  typingNotification();
  console.log('starting');
});

socket.on('isntTyping', name => {
  removeTypingNotification();
  console.log('stopping');
});

function typingNotification(name) {
  const ellipsisEl = document.createElement('p');
  ellipsisEl.classList.add(`${name}`, 'ellipsis');
  ellipsisEl.innerText = `${name} is typing...`;
  chatWindow.appendChild(ellipsisEl);
  scrollToBottom();
};

function removeTypingNotification(name) {
  const ellipsisEl = document.querySelector(`${name}`);
  ellipsisEl.remove();
  scrollToBottom();
};

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

