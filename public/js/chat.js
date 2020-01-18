'use strict'

const socket = io();

// Elements
const $messageForm = document.getElementById('send-message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById('send-location');
const $messagesContainer = document.getElementById('messages-container');

// Templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const locationMessageTemplate = document.getElementById('location-message-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


// Listeners
socket.on('message', message => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messagesContainer.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', message => {
    const html = Mustache.render(locationMessageTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a'),
        latitude: message.latitude,
        longitude: message.longitude
    });
    $messagesContainer.insertAdjacentHTML('beforeend', html);
});

// Emitters
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

socket.emit('join', { username, room });