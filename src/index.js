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

io.on('connection', () => {
    console.log('New WebSocket connection');
});

server.listen(settings.port, () => {
    console.log(`Server is up and running on port ${settings.port}!`);
});