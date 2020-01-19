const generateMessage = (text, username = 'Admin') => {
    return {
        text,
        username,
        createdAt: new Date().getTime()
    };
};

const generateLocationMessage = (username, latitude, longitude) => {
    return {
        url: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime(),
        latitude,
        longitude,
        username
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};