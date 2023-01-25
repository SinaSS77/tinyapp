// Using the Express after installing it by npm
const express = require('express');

const app = express();
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

//getting any responce to route urls and rendering by ejs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//getting any responce to route urls/news and rendering by ejs (for the submition page)
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/", (req, res) => {
  res.send("This is our home page, Welcome!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send(`<html><body><h1>This is our home page</h1><br><h3><i>Welcome!</i></h3></body></html>\n`);
});

// this is for redirecting from POST route to this page to show the user the short links
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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
  res.cookie("User Name:",username);   //by setting this we can find the username under chrome Devtools:Application:Cookies
  res.redirect('/urls');
});

app.listen(PORT, (req, res) =>{
  console.log(`The port is : ${PORT}`);
});

// test amend