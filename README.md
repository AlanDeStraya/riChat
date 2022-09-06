# RiChat - Alan and Riana's Chat App

## ToDo
- work better on mobile (keyboard hides input)
- store messages?
- someone is typing indication *

*
var typing = false;
var timeout = undefined;

function timeoutFunction(){
  typing = false;
  socket.emit(noLongerTypingMessage);
}

function onKeyDownNotEnter(){
  if(typing == false) {
    typing = true
    socket.emit(typingMessage);
    timeout = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 5000);
  }

}

let typing false
add event listener for typing to message box

on event
send typing
typing true
start timeout 7s, stop fn

stop fn:
if typing, start timeout fn
if not, send not typing, typing false
