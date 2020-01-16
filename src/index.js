const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const settings = {
    port: process.env.PORT,
    publicDir: path.join(__dirname, '../public'),
};

app.use(express.static(settings.publicDir));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    
    socket.emit('message', 'Welcome, user!');
    socket.broadcast.emit('message', 'User has joined the chat!');

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
    });

    socket.on('disconnect', () => {
        io.emit('message', 'User has left the chat!');
    });
});

server.listen(settings.port, () => {
    console.log(`Server is up and running on port ${settings.port}!`);
});