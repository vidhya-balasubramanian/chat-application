const users = [];

const addUser = (userobj) => {
  let { id, username, room } = userobj;
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required!"
    }
  }

  // check for existing user 
  const existingUser = users.find(d => d.room === room && d.username === username);
  if (existingUser) {
    return {
      error: 'Username is in use'
    }
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex(d => d.id === id);
  if (index !== 1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => {
  const index = users.findIndex(d => d.id === id);
  return users[index]
}

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  const filteredUsers = users.filter(d => d.room === room);
  return filteredUsers;
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}