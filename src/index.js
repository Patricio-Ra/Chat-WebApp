const http = require('http');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Express/HTTP Server
const settings = {
    port: process.env.PORT,
    publicDir: path.join(__dirname, '../public'),
};

app.use(express.static(settings.publicDir));
app.use(express.json());

// Socket.io/WS Server
io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('join', ({ username, room }, ackCallback) => {
        const { error, user } = addUser({ id: socket.id, username, room });
        if (error) return ackCallback(error);
        socket.join(user.room);
        socket.emit('message', generateMessage(`Welcome, ${user.showUsername}!`));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.showUsername} has joined the room!`));
        ackCallback();
    });

    socket.on('sendMessage', (message, ackCallback) => {
        const filter = new Filter();
        if (filter.isProfane(message)) {
            return ackCallback('Profanity is not allowed.');
        };
        io.emit('message', generateMessage(message));
        ackCallback();
    });

    socket.on('sendLocation', (coords, ackCallback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`, coords.latitude, coords.longitude));
        ackCallback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) io.to(user.room).emit('message', generateMessage(`${user.showUsername} has left the chat!`));
    });
});


server.listen(settings.port, () => {
    console.log(`Server is up and running on port ${settings.port}!`);
});