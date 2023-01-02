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
const fs = require("fs"); //file-stream
const multer = require("multer");
const { json } = require("body-parser");
const port = process.env.port || 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname + "/Assets")));
app.use(express.static(path.join(__dirname + "/Source")));
app.use(express.static(path.join(__dirname + "/views")));
app.use(express.static(path.join(__dirname + "/Style")));
app.use(express.static(path.join(__dirname + "/Public")));
app.use(express.static(path.join(__dirname + "/views/partials")));
app.use(morgan("combined"));
app.use(cors());
app.set("view engine", "ejs");

let storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "File uploaded");
  },
  filename: (request, file, callback) => {
    let date = new Date();
    callback(
      null,
      date.getDate.toString() +
        "-" +
        date.getMonth.toString() +
        "-" +
        date.getFullYear.toString() +
        "-" +
        file.originalname
    );
  },
});

function registerFormHandler(request, response) {
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
        console.log("Failed");
        response.render("registerFailed.ejs");
      } else {
        console.log("Success");
        database.query(
          `INSERT INTO login_data.register_info(username,pass,email,phone,DOB) VALUES('${user}','${password}','${email}','${phone}','${DOB}', 0);`,
          (err) => {
            if (err) throw err;
            response.render("registerSuccess.ejs", { username: user });
          }
        );
      }
    }
  );
}

function loginFormHandler(request, response) {
  let loginUsername = request.body.loginUsername;
  let loginPassword = request.body.loginPassword;
  database.query(
    `SELECT ID FROM login_data.register_info WHERE username = '${loginUsername}' and pass = '${loginPassword}' limit 1`,
    (err, result) => {
      if (err) throw err;
      if (Object.keys(result).length === 0) {
        response.render("loginFailed.ejs");
      } else {
        let data = JSON.parse(JSON.stringify(result));
        let userID = data[0].ID;
        database.query(
          `SELECT firstLogin FROM login_data.register_info WHERE ID = '${userID}'`,
          (err, result) => {
            if (err) throw err;
            let checkLogin = JSON.parse(JSON.stringify(result));
            if (checkLogin[0].firstLogin == 1) {
              database.query(
                `CREATE TABLE IF NOT EXISTS login_data.ID${userID}_profile (profileImage VARCHAR(255), alias VARCHAR(255), realName VARCHAR(255), DOB VARCHAR(255), address VARCHAR(255), phone VARCHAR(255), workplace VARCHAR(255), education VARCHAR(255), interest VARCHAR(255), message VARCHAR(1000))`,
                (err) => {
                  if (err) throw err;
                  response.render("index.ejs", {
                    ID: userID,
                    user: loginUsername,
                    loginState: true,
                  });
                }
              );
            } else {
              // database.query(
              //   `UPDATE login_data.register_info SET firstLogin = 1 WHERE ID = '${userID}'`
              // );
              response.render('CreateProfile.ejs');
            }
          }
        );
      }
    }
  );
}

function profileHandler(request, response) {
  let ID = request.query.ID;
  console.log(ID);
  database.query(`SELECT * FROM login_data.id${ID}_profile`, (err, result) => {
    if (err) throw err;
    let data = JSON.parse(JSON.stringify(result));
  });
}

app.listen(port, (err) => {
  if (err) throw err;
  console.log("Connection established at port: " + port);
});

app.get("/", (request, response) => {
  response.render("index.ejs", { loginState: false });
});

app.post("/", (request, response) => {
  loginFormHandler(request, response);
});

app.post("/registerResult", (request, response) => {
  registerFormHandler(request, response);
});

app.get("/user", (request, response) => {
  // response.render("Profile/profile.ejs", {user: user, });
  profileHandler(request, response);
});

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Haido29904@",
});

database.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});
