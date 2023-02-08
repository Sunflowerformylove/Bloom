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
const cookieParser = require("cookie-parser");
const port = process.env.port || 3000;

const app = express();
app.use(cookieParser());
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

let date = new Date();
let dateOfMonth = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
let storage = multer.diskStorage({
  destination: (request, avatar, callback) => {
    callback(null, path.join(__dirname + "/Assets/Images/ProfilePic"));
  },
  filename: (request, avatar, callback) => {
    callback(
      null,
      `${Date.now()}${dateOfMonth}${month + 1}${year}${avatar.originalname}`
    );
  },
});

let upload = multer({ storage: storage });

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
            response.cookie('loginState', 'true');
            if (checkLogin[0].firstLogin === 1) {
              response.render("index.ejs", { ID: userID, loginState: true });
            } else {
              response.render("CreateProfile.ejs", { ID: userID });
            }
          }
        );
      }
    }
  );
}

function profileHandler(request, response) {
  let ID = request.query.ID;
  database.query(
    `SELECT * FROM login_data.user_profile WHERE ID = '${ID}'`,
    (err, result) => {
      if (err) throw err;
      let data = JSON.parse(JSON.stringify(result));
      response.render("profile.ejs", { ID: ID, data: data });
    }
  );
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

app.post("/firstLogin", upload.single("avatar"), (request, response) => {
  let date = new Date();
  let dateOfMonth = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let alias = request.body.alias;
  let gender = request.body.gender;
  let avatar = request.file.filename;
  let realName = request.body.realName;
  let workplace = request.body.workplace;
  let education = request.body.education;
  let interest = request.body.interests;
  let ID = request.body.ID;
  database.query(
    `INSERT INTO login_data.user_profile(ID,alias,gender,realName,workplace,education,interest,avatar) VALUES('${ID}','${alias}', '${gender}', '${realName}', '${workplace}', '${education}','${interest}','${avatar}')`,
    (err) => {
      if (err) throw err;
      database.query(
        `UPDATE login_data.register_info SET firstLogin = 1 WHERE ID = ${ID}`,
        (err) => {
          if (err) throw err;
          response.render("index.ejs", { ID: ID, loginState: true });
        }
      );
    }
  );
});

app.post("/registerResult", (request, response) => {
  registerFormHandler(request, response);
});

app.get("/user", (request, response) => {
  profileHandler(request, response);
});

app.post(
  "/user",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "background", maxCount: 1 },
  ]),
  (request, response) => {
    let data = request.body;
    let avatar = request.files.avatar;
    let background = request.files.background;
    database.query(
      `UPDATE login_data.user_profile SET alias = '${data.alias}', gender = '${data.gender}', realName = '${data.realName}',workplace = '${data.workplace}',education = '${data.education}'`
    );
    if (avatar !== undefined) {
      database.query(
        `UPDATE login_data.user_profile SET avatar = '${avatar[0].filename}'`
      );
    }
    if (background !== undefined) {
      database.query(
        `UPDATE login_data.user_profile SET background = '${background[0].filename}'`
      );
    }
    profileHandler(request, response);
  }
);

app.get("/shop", (request, response) => {
  response.render("shop.ejs", { loginState: false});
});

app.get("/shop/search", (request, response) => {
  let searchParam = request.query.search;
  database.query(`SELECT * FROM shop.products WHERE 'name' LIKE '%${searchParam}%' OR 'description' LIKE '%${searchParam}%' OR 'collection' LIKE '%${searchParam}%' OR 'type' LIKE '%${searchParam}%'`,(err, result) => {
    if (err) throw err;
    response.render('shop.ejs');
  });
});

app.post("/shop", (request, response) => {
  let ID = request.body.ID;
  let data;
  database.query(
    `SELECT alias, avatar FROM login_data.user_profile WHERE id = '${ID}'`,
    (err, result) => {
      data = result;
      response.render("shop.ejs", {
        ID: ID,
        loginState: true,
        data: data,
      });
    }
  );
});

app.get('/api/products',(request, response) => {
  database.query('SELECT * FROM shop.products', (err, result) => {
    if(err) throw err;
    let data = JSON.stringify(result);
    response.json(result);
  })
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
