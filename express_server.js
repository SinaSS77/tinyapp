
const cookieSession = require('cookie-session');
const express = require('express');// Using the Express after installing it by npm
const {getUserByEmail ,getUserById, urlsForUser, getRandomString} = require("./functions");
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 8080;
// const cookieParser = require('cookie-parser');// Using the cookie-parser after installing it by npm
// app.use(cookieParser());// we exchange this one with the cookie-session
app.use(express.urlencoded({ extended: true })); //will translate, or parse the body  and make it readable for us humans. This feature is part of Express.
app.use(cookieSession({//after installing the cookie-session to save the cookies in a secure way
  name: 'session',
  keys: ["SunnyDays"]
}));
app.set("view engine", "ejs"); //for using the templates in the views folder after insalling the EJS by npm


/////////+++++++++ NECESSARY DATABASE++++++++++++
//using an object instead of url-database and users
const urlDatabase = {};
const users = {};


/***********   ROUTS: GET */
/************************ */

// for homepage
app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// register page
app.get("/register", (req,res) => {
  const templateVars = {user: null};
  res.render("urls_register", templateVars);
});

//registration validation, adding the information of user to the user list
//reading the user information with (req.body)  AND   sending the information to the cookie with (res.cookie) and redirect to /urls
app.post("/register",(req,res) => {
  let email = req.body.email;
  const hashedPassword = bcrypt.hashSync((req.body.password),10);
  if (!email || !hashedPassword) {
    res.status(400).send("You can not leave the password or email boxes empty!");
  }
  if (!getUserByEmail(email)) {
  //1. Generating the new random ID
    const id = getRandomString();
    //2. Create a new user in the users Database
    users[id] = {id, email, hashedPassword};
    // console.log("==============>>>>",users);
    req.session.user_id = id;
    res.redirect('/urls');
    return;
  }
  res.status(400).send("This email already exists. Either please log in with or choose another email address.");
});

// login page
app.get("/login", (req,res) => {
  let templateVars = {user: null};
  res.render("urls_login", templateVars);
});

// a post to handle the login form value
app.post("/login",(req,res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync((req.body.password),10);
  const userID = getUserByEmail(email, users);
  if (!email || !password) {
    return res.status(400).send("Please enter a valid email and valid password");
  }
  if (userID === null) {
    return res.status(400).send("Your email is not in registered in this website!");
  }
  for (let key in users) {
    if (email === users[key].email && bcrypt.compareSync(req.body.password , password)) {
      res.session("user_id",users[key].id);   //by setting this we can find the user_id under chrome Devtools:Application:Cookies
      res.redirect("/urls");
      return;
    }
  }
  res.status(403).send("Either your email address or your password is incorrect!");
});

// a post to handle the logout form in the header
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

//a page for showing the urls
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const usersURLs = urlsForUser(userID, urlDatabase);
  const user = getUserById(userID, users);
  if (!user) {
    return res.redirect("/login");
  } else {
    const templateVars = {
      urls: usersURLs,
      user: users[userID],
    };
    return res.render("urls_index", templateVars);
  }
});

//by clicking on the Submit button we use from these things :action, name and method to post our reqest and implement functions and store the shortURL and redirect to /urls/:id
app.post("/urls", (req, res) => {
  const shortURL = getRandomString();
  const userID = req.session.user_id;
  const user = getUserById(userID, users);
  if (user) {
    urlDatabase[shortURL] = {
      userID: userID,
      longURL: req.body.longURL,
    };
    // console.log("=======>>>> ", urlDatabase);
    res.redirect(`/urls/${shortURL}`);
    return;
  } else {
    res.status(400).send("To see the urls, you have to first login");
    return;
  }
});

//getting any responce to route urls/news and rendering by ejs (for the submition page)
app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const user = getUserById(userID, users);
  if (user === null) {
    return res.redirect("/login");
  }
  const templateVars = {urls: urlDatabase, user: users[userID]};
  res.render("urls_new", templateVars);
});

// inside the urls_show.ejs it is defined in the anchor link that by click on the shortURLs it should go to the /u/:id. and inside of this we define that it should redirect to the longURL

app.get("/u/:id", (req, res) => {
  if (req.params.id) {
    const longURL = urlDatabase[req.params.id].longURL;
    res.redirect(longURL);
    return;
  }
  res.status(400).send("This Link is not reachable!");
  return;
});

// this is for redirecting from POST route to this page to show the user short links
app.get("/urls/:id", (req, res) => {
  let templateVars = {};
  const userID = req.session.user_id;

  if (userID) {
    const userURLs = urlsForUser(userID, urlDatabase);
    const shortURL = req.params.id;
    if (userURLs[shortURL]) {
      const longURL = urlDatabase[shortURL].longURL;
      templateVars.user = users[userID];
      templateVars.longURL = longURL;
      templateVars.shortURL = shortURL;
    } else {
      templateVars.user = users[userID];
      templateVars.shortURL = null;
    }
  }
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(400).send("You may not logged in!");
  } else {
    const userURLs = urlsForUser(userID, urlDatabase);
    const targetUserURLS = userURLs[req.params.id];
    if (targetUserURLS) {
      urlDatabase[req.params.id].longURL = req.body.longURL;
      res.redirect("/urls");
    } else {
      return res.status(400).send("You may not logged in!");
    }
  }
});

app.post("/urls/:id/delete", (req, res) => {
  const userID = req.session.user_id;
  if (!userID) {
    return res.status(400).send("You are only allowed to delete your own URLs!");
  } else {
    const userURLs = urlsForUser(userID, urlDatabase);
    if (userURLs[req.params.id]) {
      delete urlDatabase[req.params.id];
      res.redirect("/urls");
    } else {
      return res.status(400).send("You are only allowed to delete your own URLs!");
    }
  }
});

/***********   ROUTS : POSTS */
/*************************** */

app.post("/urls/:id/delete",(req,res) =>{
  delete urlDatabase[req.params.id];
  res.redirect(`/urls`);
});


app.listen(PORT, (req, res) =>{
  console.log(`The port is : ${PORT}`);
});


