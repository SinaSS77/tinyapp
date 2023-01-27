
const urlsForUser = (id, urlDatabase) => {
  let userURLdata = {};
  for (const url in urlDatabase) {
    if (id === urlDatabase[url].userID) {
      userURLdata[url] = urlDatabase[url];
    }
  }
  return userURLdata;
};

//create a random 6 character string for short url
const getRandomString = () => {
  let randomStr = '';
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    randomStr += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
  }
  return randomStr;
};

const getUserById = (id, users) => { // returns an object
  const user = users[id];
  console.log(users[id]);
  if (user) {
    return user;
  }
  return null;
};
const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const getUserByEmail = (email, users) => {
  for (const id in users) {
    if (email === users[id].email) {
      return users[id];
    }
  }
  return null;
};


module.exports = { getRandomString, getUserById, getUserByEmail, urlsForUser};