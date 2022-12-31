"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const lodash = require("lodash");
const morgan = require("morgan");
const ejs = require("ejs");
const mongo = require("mongodb");
const path = require("path");
const cors = require("cors");
const exp = require("constants");
const port = process.env.port || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname + "/Assets")));
app.use(express.static(path.join(__dirname + "/Source")));
app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/Style")));
app.use(express.static(path.join(__dirname + "/SCSS")));
app.use(express.static(path.join(__dirname + "/Public")));
app.use(morgan("combined"));
app.use(cors());
app.set("view engine", "ejs");

function registerFormHandler(request,response) {
  let user = request.body.registerUsername;
  let password = request.body.registerPassword;
  let email = request.body.registerEmail;
  let phone = request.body.registerPhone;
  let DOB = request.body.registerDOB;
  database.query(
    `SELECT username FROM login_data.register_info WHERE username = '${user}'`,
    (err, result) => {
      if (err) throw err;
      if (Object.keys(result).length !== 0) {
        console.log('Failed');
        response.render("registerFailed.ejs");
      } else {
        console.log('Success');
        database.query(
          `INSERT INTO login_data.register_info(username,pass,email,phone,DOB) VALUES('${user}','${password}','${email}','${phone}','${DOB}')`,
          (err) => {
            if(err) throw err;
            response.render("registerSuccess.ejs", {username: user});
          }
        );
      }
    }
  );
}

app.listen(port, (err) => {
  if (err) throw err;
  console.log("Connection established at port: " + port);
});

app.get("/", (request, response) => {
  response.render("index.ejs");
});

app.post("/registerResult", (request,response) =>{
  registerFormHandler(request,response);
})

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Haido29904@",
});

database.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});
