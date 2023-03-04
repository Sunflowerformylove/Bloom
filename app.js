"use strict";
const express = require("express");
const aws = require("aws-sdk");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const lodash = require("lodash");
const morgan = require("morgan");
const ejs = require("ejs");
const mongo = require("mongodb");
const path = require("path");
const cors = require("cors");
const fs = require("fs"); //file-stream
const multer = require("multer"); //file upload to local filesystem
const multerS3 = require('multer-s3'); //file upload to Amazon S3
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mysqlSession = require("express-mysql-session")(session);
const crypto = require("crypto-js");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const qrCode = require("qrcode");
const port = process.env.port || 3000;
const awsConfig = {
  BUCKET: "bloomproj",
  REGION: "ap-southeast-1",
  ACCESS_KEY: "AKIA2V2KZNBWFIQ4IB6I",
  SECRET_KEY: "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"
}

let emailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  service: 'gmail',
  auth: {
    user: "noreplybloomsite@gmail.com",
    pass: "kskutofsjuwrriqv",
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
}
}

aws.config.update({
  accessKeyId: awsConfig.ACCESS_KEY,
  secretAccessKey: awsConfig.SECRET_KEY,
  region: awsConfig.REGION,
});

const S3 = new aws.S3();
const cloudFront = new aws.CloudFront();

const storeOption = {
    host: "localhost",
    port: '3306',
    user: "root",
    password: "Haido29904@",
    database: "login_data",
    clearExpired: true,
    checkExpirationInterval: 60 * 60 * 1000, //check for expired session every hour,
    expiration: 30 * 24 * 60 * 60 * 1000, //expire after 30 days, in milliseconds
    createDatabaseTable: true,
    schema : {
      tableName: "session",
      columnNames: {
        session_id: "sessionID",
        expires: "expires",
        data: "data",
      }
    }
  }

  
let date = new Date();
let dateOfMonth = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();

// let storageLocal = multer.diskStorage({
//   destination: (request, avatar, callback) => {
//     callback(null, path.join(__dirname + "/Assets/Images/ProfilePic"));
//   },
//   filename: (request, avatar, callback) => {
//     callback(
//       null,
//       `${Date.now()}${dateOfMonth}${month + 1}${year}${avatar.originalname}`
//     );
//   },
// });

let storageS3 = multerS3({
  s3: S3,
  bucket: 'bloomproj',
  acl: 'public-read',
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, `Assets/Images/ProfilePic/${Date.now().toString()}${file.originalname}`);
  },
})

let secret = speakeasy.generateSecretASCII();

// const storeOption = {
//     host: "database-1.ctbibtd7skr7.ap-southeast-1.rds.amazonaws.com",
//     port: '3306',
//     user: "admin",
//     password: "Haido29904",
//     database: "login_data",
//     clearExpired: true,
//     checkExpirationInterval: 60 * 60 * 1000, //check for expired session every hour,
//     expiration: 30 * 24 * 60 * 60 * 1000, //expire after 30 days, in milliseconds
//     createDatabaseTable: true,
//     schema : {
//       tableName: "session",
//       columnNames: {
//         session_id: "sessionID",
//         expires: "expires",
//         data: "data",
//       }
//     }
//   }

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
app.use(session
  ({
  name: "userSession",
  store: new mysqlSession(storeOption),
  secret: "my precious",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, //expire after 30 days, in milliseconds
  }
})
);

app.set("view engine", "ejs");

let upload = multer({ storage: storageS3 });

function registerFormHandler(request, response) {
  let user = request.body.registerUsername;
  let password = crypto.enc.Base64.stringify(crypto.SHA256(request.body.registerPassword));
  let email = request.body.registerEmail;
  let phone = request.body.registerPhone;
  let DOB = request.body.registerDOB;
  database.query(
    `SELECT username FROM login_data.register_info WHERE username = '${user}'`,
    (err, result) => {
      if (err) throw err;
      if (Object.keys(result).length !== 0) {
        response.render("registerFailed.ejs");
      } else {
        database.query(
          `INSERT INTO login_data.register_info(username,pass,email,phone,DOB,firstLogin) VALUES('${user}','${password}','${email}','${phone}','${DOB}', 0);`,
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
  let loginPassword = crypto.enc.Base64.stringify(crypto.SHA256(request.body.loginPassword));
  database.query(
    `SELECT ID FROM login_data.register_info WHERE username = '${loginUsername}' and pass = '${loginPassword}' limit 1`,
    (err, result) => {
      if (err) throw err;
      if (Object.keys(result).length === 0) {
        console.log(loginPassword);
        response.render('loginFailed.ejs');
      } else {
        let data = JSON.parse(JSON.stringify(result));
        let userID = data[0].ID;
        database.query(
          `SELECT firstLogin FROM login_data.register_info WHERE ID = '${userID}'`,
          (err, result) => {
            if (err) throw err;
            let checkLogin = JSON.parse(JSON.stringify(result));
            if (checkLogin[0].firstLogin === 1) {
              if(Object.keys(request.cookies).length === 0){
                request.session.user = {userID: userID, username: loginUsername, loginState: true, timestamp: date};
                response.render('index.ejs', {ID: userID, loginState: true, timestamp: date});
              }
            } else {
              request.session.user = {userID: userID, username: loginUsername, loginState: true, timestamp: date};
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
  let signOut = request.query.signOut;
  if (signOut === undefined) {
    if(Object.keys(request.cookies).length === 0){
      response.render("index.ejs", { loginState: false });
    }
    else{
      let session = request.sessionID;
      database.query(`SELECT data FROM login_data.session WHERE sessionID = '${session}'`, (err, result) => {
        if (err) throw err;
        let data = JSON.parse(JSON.parse(JSON.stringify(result))[0].data).user;
        response.render("index.ejs", { ID: data.userID, loginState: true});
      });
    }
  }
  else if(signOut === "true") {
    request.session.destroy();
    response.clearCookie("userSession");
    response.render("index.ejs", {loginState: false});
  };
});

app.post("/", upload.none(), (request, response) => {
  loginFormHandler(request, response);
});

app.post('/payment', (request, response) => {
  response.render("payment.ejs");
});

app.post("/firstLogin", upload.single("avatar"),(request, response) => {
  let date = new Date();
  let dateOfMonth = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let alias = request.body.alias;
  let gender = request.body.gender;
  let avatar = request.file.key;
  let realName = request.body.realName;
  let workplace = request.body.workplace;
  let education = request.body.education;
  let interest = request.body.interests;
  let ID = request.body.ID;
  database.query(
    `INSERT INTO login_data.user_profile(ID,alias,gender,realName,workplace,education,interest,avatar) VALUES('${ID}','${alias}', '${gender}', '${realName}', '${workplace}', '${education}','${interest}','${avatar}')`,
    (err) => {
      if (err) throw err;
       database.query(`UPDATE login_data.register_info SET firstLogin = 1 WHERE ID = ${ID};`);
       database.query(`SELECT email FROM login_data.register_info WHERE ID = ${ID}`,(err, result) => {
        if (err) throw err;
        let email = result[0].email;
        let hotp = speakeasy.hotp({
          secret: secret,
          counter: Math.floor((Date.now()/ 1000) / 1800),
          digits: 6,
          encoding: "ascii",
          algorithm: "sha256",
        });
        let otpMessage = {
          from : 'noreplybloomsite@gmail.com',
          to: email,
          subject: 'Welcome to Bloom',
          text: `Welcome to our site. This is your ONE-TIME PASSWORD: ${hotp}. Please note that this OTP will expire in the next 24 hour. Best regards, Hai Do.`,
          html: `<p style = "font-size: 16px; font-family: 'Arima',serif;">Welcome to our site. 
          <br>
          <br>
          This is your ONE-TIME PASSWORD: <strong>${hotp}</strong>. 
          <br>          
          Please note that this OTP will expire in the next 30 minutes. 
          <br>
          <br>
          Best regards,
          <br> 
          Hai Do.</p>`,
          header: {
            'X-Priority' : '1 (Highest)',
            'X-MSMail-Priority' : 'High',
            'Priority' : 'High',
          }
        }
        let transporter = nodemailer.createTransport(emailConfig);
        transporter.sendMail(otpMessage, (err, info) => {
          if (err) throw err;
          response.render("authentication.ejs", {email: email, ID: ID});
        });
       })
    }
  );
});

app.post("/authentication", (request, response) => {
  let data = request.body;
  let userOTP = data.OTP;
  let ID = data.ID;
  let verify = speakeasy.hotp.verify({
    secret: secret,
    token: userOTP,
    counter: Math.floor((Date.now()/ 1000) / 1800),
    digits: 6,
    encoding: "ascii",
    algorithm: "sha256",
    window: 60,
  });
  if(verify){
    database.query(`UPDATE login_data.register_info SET authenticated = 1 WHERE ID = ${ID};`, (err) => {
      if(err) throw err;
      response.render('index.ejs', {ID: ID, loginState: true});
    });
  }
  else{
    response.send({verified: false});
  }
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
        `UPDATE login_data.user_profile SET avatar = '${avatar[0].key}'`
      );
    }
    if (background !== undefined) {
      database.query(
        `UPDATE login_data.user_profile SET background = '${background[0].key}'`
      );
    }
    profileHandler(request, response);
  }
);

app.get("/shop", (request, response) => {
  response.render("shop.ejs", { loginState: false});
});

app.get("/authentication",(request, response) => {
  response.render("authentication.ejs");
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

app.get('/payment', (request, response) => {
  response.render("payment.ejs");
})

app.get('/login', (request, response) => {
  response.sendFile(path.join(__dirname + '/Public/Login/login.html'));
}); 

// const database = mysql.createConnection({
//   host: "database-1.ctbibtd7skr7.ap-southeast-1.rds.amazonaws.com",
//   user: "admin",
//   password: "Haido29904",
//   port: '3306',
// });

app.use((request,response) => {
  response.status(404).sendFile(path.join(__dirname + '/Public/Status Handler/404.html'));
}); // 404 handling

const database = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Haido29904@",
  port: '3306',
});


database.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});