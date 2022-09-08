const socket = io();
const chatWindow = document.getElementById('chat-window');
const chatWindowMessages = document.getElementById('chat-window-messages');
const chatWindowTyping = document.getElementById('chat-window-typing');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const checkMessagesButton = document.getElementById('chat-label');
const checkUserButton = document.getElementById('check-users');
const userList = document.getElementById('user-list');
let list;
let typing;
let timer;
const username = prompt('Enter your username');
renderMessage('You joined');
socket.emit('new-user', username);

if(username === 'Pookie') {
  renderMessage('Pookie-detection-bot: I love you SMASM');
} else if(username === 'Riana') {
  renderMessage('Riana-detection-bot: You are the love of my life');
}

chatForm.addEventListener('submit', submitChat);

chatInput.addEventListener('keypress', handleTyping);

checkUserButton.addEventListener('click', checkUsers);

checkMessagesButton.addEventListener('click', checkMessages);

console.log('running');

socket.on('user-connected', name => {
  renderMessage(`${name} connected`);
});

socket.on('all-users', users => {
  userList.innerText = listOnlineUsers(users);
});

socket.on('chat-message', data => {
  renderMessage(`${data.name}: ${data.message}`);
});

socket.on('user-disconnected', name => {
  renderMessage(`${name} disconnected`);
});

socket.on('message-history', obj => {
  let msgHist = ''
  for (let m in obj) {
    msgHist += `${obj[m].sender}: ${obj[m].message} at ${obj[m].timestamp}\n`;
  }
  chatWindowMessages.innerText = msgHist;
});

socket.on('isTyping', name => {
  typingNotification(name);
});

socket.on('isntTyping', name => {
  removeTypingNotification(name);
});



function stopTyping() {
  typing = false;
  socket.emit('notTyping', username);
};

function handleTyping(event) {
  if(event.code === 'Enter') {
    clearTimeout(timer);
    return;
  }
  if(typing) {
    clearTimeout(timer);
    timer = setTimeout(stopTyping, 7000);
  } else {
    typing = true;
    socket.emit('typing', username);
    timer = setTimeout(stopTyping, 7000);
  }
}

function typingNotification(name) {
  const ellipsisEl = document.createElement('p');
  ellipsisEl.classList.add(`${name}`, 'ellipsis');
  ellipsisEl.innerText = `${name} is typing...`;
  chatWindowTyping.appendChild(ellipsisEl);
  scrollToBottom();
};

function removeTypingNotification(name) {
  const ellipsisEl = document.querySelector(`p.${name}`);
  ellipsisEl.remove();
  scrollToBottom();
};

function submitChat(event) {
  event.preventDefault();
  if(typing) {
    stopTyping();
  }
  const message = chatInput.value;
  renderMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  chatInput.value = '';
}

function renderMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('render-message');
  msgDiv.innerText = message;
  chatWindowMessages.appendChild(msgDiv);
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

