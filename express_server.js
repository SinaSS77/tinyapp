// Using the Express after installing it by npm
const express = require('express');
// Using the cookie-parser after installing it by npm
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
//defining the port
const PORT = 8080;

app.use(express.urlencoded({ extended: true })); //will translate, or parse the body  and make it readable for us humans. This feature is part of Express.
app.set("view engine", "ejs"); //for using the templates in the views folder after insalling the EJS by npm

//Temporary using an object instead of database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


// a function to generate 6length random string as our shortURL (id)
const generateRandomString = function() {
  let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};


/***********   ROUTS */
/******************* */


const users = {
  userID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },

};

const getUserByEmail = (email) => {
  
  for (let key in users) {
    console.log(key);
    if (users[key].email === email) {
      return key;
    }
  }
  return null;
};

app.post("/register",(req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.status(400).send("You can not leave the password or email boxes empty!");
  }
  if (!getUserByEmail(email)) {
  //1. Generating the new random ID
    const id = generateRandomString();
    //2. Create a new user in the users Database
    users[id] = {id, email, password};

    res.cookie("user_id", id);
    res.redirect('/urls');
  }
  res.status(400).send("This email already exists. Either please log in with or choose another email address.");
});

app.get("/register", (req,res) => {
  let templateVars = {user: null};
  res.render("urls_register", templateVars);
});




//getting any responce to route urls and rendering by ejs
app.get("/urls", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];

  const templateVars = {user,urls: urlDatabase};
  res.render("urls_index", templateVars);
});

//getting any responce to route urls/news and rendering by ejs (for the submition page)
app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];

  const templateVars = {user};
  res.render("urls_new", templateVars);
});

// app.get("/", (req, res) => {
//   res.send("This is our home page, Welcome!");
// });
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });
// app.get("/hello", (req, res) => {
//   res.send(`<html><body><h1>This is our home page</h1><br><h3><i>Welcome!</i></h3></body></html>\n`);
// });

// this is for redirecting from POST route to this page to show the user the short links
app.get("/urls/:id", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];

  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: user};
  res.render("urls_show", templateVars);
});

// inside the urls_show.ejs it is defined in the anchor link that by click on the shortURLs it should go to the /u/:id. and inside of this we define that it should redirect to the longURL

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});



/***********   POSTS */
/******************* */

//by clicking on the Submit button we use from these things :action, name and method to post our reqest and implement functions and store the shortURL and redirect to /urls/:id
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  console.log(req.body); // Log the POST request body to the console
  console.log(shortURL);
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
  // res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete",(req,res) =>{
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  let longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls`);
});

// a post to handle the login form value
app.post("/login",(req,res) => {
  const username = req.body.username;
  res.cookie("username",username);   //by setting this we can find the username under chrome Devtools:Application:Cookies
  res.redirect('/urls');
});



// a post to handle the logout form in the header
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/register");
});



app.listen(PORT, (req, res) =>{
  console.log(`The port is : ${PORT}`);
});

// test amend