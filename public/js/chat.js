'use strict'

const socket = io();
const sendMessageForm = document.getElementById('sendMessageForm');

socket.on('message', (message) => {
    console.log(message);
});

sendMessageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.message.value.trim() !== '') {
        const message = e.target.message.value;
        socket.emit('sendMessage', message);
        e.target.message.value = '';
    };
});

