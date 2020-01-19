'use strict'

const socket = io();

// Elements
const $messageForm = document.getElementById('send-message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById('send-location');
const $messagesContainer = document.getElementById('messages-container');
const $usersSidebar = document.getElementById('sidebar');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


// Listeners
socket.on('message', ({ text, username, createdAt }) => {
    const html = Mustache.render(messageTemplate, {
        message: text,
        username,
        createdAt: moment(createdAt).format('h:mm a')
    });
    $messagesContainer.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', ({ url, username, latitude, longitude, createdAt }) => {
    const html = Mustache.render(locationMessageTemplate, {
        url,
        username,
        latitude,
        longitude,
        createdAt: moment(createdAt).format('h:mm a')
    });
    $messagesContainer.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
        count: users.length
    });
    $usersSidebar.innerHTML = html;
});

// Emitters
socket.emit('join', { username, room }, error => {
    if (error) {
        alert(error);
        location.href = '/';
    };
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let message = e.target.message.value;

    if (message.trim() !== '') {
        $messageFormButton.setAttribute('disabled', 'disabled');
        socket.emit('sendMessage', message, error => {
            $messageFormButton.removeAttribute('disabled');
            $messageFormInput.value = '';
            $messageFormInput.focus();
            if (error) {
                return console.log(error);
            };
            console.log('Delivered');
        });
    };
});

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your Browser version.');
    };
    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    });
});