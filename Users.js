let users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // user.name === trimmerName && user.room === trimmerRoom
  const existingUser = users.find(
    user => user?.name === name && user?.room === room
  );
  console.log("existingUser", existingUser);
  if (existingUser) {
    return { error: "User already exists!" };
  }

  const user = { id, name, room };

  users.push(user);

  return user;
};

const getUserById = (id) =>{
  const user = users.find((user) => user.id === id);
  return user;
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  addUser,
  removeUser,
  getUserById
};
