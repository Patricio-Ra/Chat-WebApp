const users = [];

const addUser = ({ id, username, room }) => {
    // Clean data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate data
    if (!username || !room) return { error: 'Username and room must be provided.'};
    
    // Check for existing user
    const existingUser = users.find(user => user.room === room && user.username === username);
    if (existingUser) return { error: 'Username is already in use.' };

    // Store and return user
    const user = { id, username, room };
    users.push(user);
    return { user };
};

const removeUser = id => {
    // Get the disconnected user socket
    const index = users.findIndex(user => user.id === id);

    // Remove it and return it
    if (index > -1) return users.splice(index, 1)[0];
};

const getUser = id => {
    // Returns the user or undefined
    return users.find(user => user.id === id);
};

const getUsersInRoom = room => {
    // Returns an empty or room's users array
    room = room.trim().toLowerCase();
    return users.filter(user => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};