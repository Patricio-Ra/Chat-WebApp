const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Express Server
const settings = {
    port: process.env.PORT,
    publicDir: path.join(__dirname, '../public'),
};

app.use(express.static(settings.publicDir));
app.use(express.json());

// Socket.io Server
io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    
    socket.emit('message', 'Welcome, user!');
    socket.broadcast.emit('message', 'User has joined the chat!');

    socket.on('sendMessage', (message, ackCallback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return ackCallback('Profanity is not allowed.');
        };
        io.emit('message', message);
        ackCallback();
    });

    socket.on('sendLocation', (coords, ackCallback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`);
        ackCallback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'User has left the chat!');
    });
});


server.listen(settings.port, () => {
    console.log(`Server is up and running on port ${settings.port}!`);
});