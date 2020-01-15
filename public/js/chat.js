'use strict'

const socket = io();

socket.on('countUpdated', (count) => {
    console.log('The count has been updated: ' + count);
});

document.getElementById('incrementBtn').addEventListener('click', (e) => {
    console.log('Clicked!');
    socket.emit('increment');
});