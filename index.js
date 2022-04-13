const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const mySQL_store = require("express-mysql-session")(session);
const Router = require("./router");

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

// Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loginapp",
});

db.connect(function (err) {
  if (err) {
    console.log("Databse had an issue");
    throw err;
    return false;
  }
});

// Sessions
const session_store = new mySQL_store(
  {
    expiration: 300000000,
    endConnectionOnClose: false,
  },
  db
);

app.use(
  session({
    key: "32332sdadsfa232asd",
    secret: "dfas232324fcdsfa",
    store: session_store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 300000000,
      httpOnly: false,
    },
  })
);

new Router(app, db);

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000);
