const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
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



app.listen(PORT, (req, res) =>{
  console.log(`The port is : ${PORT}`);
});
