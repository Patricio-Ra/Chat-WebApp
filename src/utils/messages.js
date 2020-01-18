const generateMessage = text => {
    return {
        text,
        createdAt: new Date().getTime()
    };
};

const generateLocationMessage = (url, latitude, longitude) => {
    return {
        url,
        createdAt: new Date().getTime(),
        latitude,
        longitude
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};