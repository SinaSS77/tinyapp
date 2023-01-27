const { assert } = require('chai');

const { getUserByEmail, urlsForUser, getRandomString, getUserById } = require('../helpers.js');

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

const testURLDatabase = {
  b6UTxQ: { longURL: "https://genius.com/Zayn-dusk-till-dawn-lyrics", userID: "wSS77g" },
  i245bv: { longURL: "https://www.youtube.ca", userID: "bb1234" },
  i245G3: { longURL: "https://www.yahoo.ca", userID: "bb1234" }
};



describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  
  it('should return null with a non-existent email', function () {
    const actual = getUserByEmail("invalid@example.com", testUsers);
    const expectedOutput = null;
    assert.strictEqual(actual, expectedOutput);
  });
});

describe('urlsForUser', function () {
  it('if there is no short url, should return an empty object', function () {
    const actual = urlsForUser("user", testURLDatabase);
    const expected = {};
    assert.deepEqual(actual, expected);
  });

  it('should return an object with shortURL for user', function () {
    const actual = urlsForUser("wSS77g", testURLDatabase);
    const expected = { b6UTxQ: { longURL: 'https://genius.com/Zayn-dusk-till-dawn-lyrics', userID: 'wSS77g' } };
    assert.deepEqual(actual, expected);
  });
});

describe('generateRandomString', function () {
  it('should return a string', function () {
    const actual = typeof getRandomString();
    const expected = "string";
    assert.strictEqual(actual, expected);
  });

  it('checking the length of output random string', function () {
    const actual = getRandomString().length;
    const expected = 6;
    assert.strictEqual(actual, expected);
  });
});


describe('getUserById', function () {
  it('should return undefined if there is no user exist', function () {
    const actual = typeof getUserById("sina", testUsers);
    assert.isOk(actual, undefined);
  });

  it('should return an object(user) if there is a match user', function () {
    const actual = getUserById("userRandomID", testUsers);
    const expected = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    assert.deepEqual(actual, expected);
  });
});
