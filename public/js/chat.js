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

const autoscroll = () => {
// Get new message DOM element.
const $newMessage = $messagesContainer.lastElementChild;
// Get the complete height of the new message element.
const newMessageStyles = getComputedStyle($newMessage);
const newMessageMargin = parseInt(newMessageStyles.marginBottom);
const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
// Get the visible height: Messages container DOM element OFFSET Height
const visibleHeight = $messagesContainer.offsetHeight;
// Get total height of messages container DOM element.
const containerHeight = $messagesContainer.scrollHeight;
// Get the user scroll position.
const scrollOffset = Math.ceil($messagesContainer.scrollTop + visibleHeight);
// Check the scroll position BEFORE the new message is added in.
if (containerHeight - newMessageHeight <= scrollOffset + 10) {
$messagesContainer.scrollTop = containerHeight;
};
};

// Listeners
socket.on('message', ({ text, username, createdAt }) => {
    const html = Mustache.render(messageTemplate, {
        message: text,
        username,
        createdAt: moment(createdAt).format('h:mm a')
    });
    $messagesContainer.insertAdjacentHTML('beforeend', html);
    autoscroll();
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
    autoscroll();
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
        });
    });
});