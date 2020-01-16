'use strict'

const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

document.getElementById('sendMessageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.message.value.trim() !== '') {
        const message = e.target.message.value;
        socket.emit('sendMessage', message);
        e.target.message.value = '';
    };
});

document.getElementById('sendLocation').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your Browser version.');
    };

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    });
});
