'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const lodash = require('lodash');
const morgan = require('morgan');
const ejs = require('ejs');
const mongo = require('mongodb');
const path = require('path');
const cors = require('cors');
const exp = require('constants');
const port = process.env.port || 3000;

const app = express();
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname + '/Assets')));
app.use(express.static(path.join(__dirname + '/Source')));
app.use(express.static(path.join(__dirname + '/views')));
app.use(express.static(path.join(__dirname + '/Style')));
app.use(express.static(path.join(__dirname + '/SCSS')));
app.use(morgan('combined'));
app.use(cors());
app.set('view engine', 'ejs');

app.listen(port, (err) => {
    if(err) throw err;
    console.log("Connection established at port: " + port);
});

app.get('/', (request,response) => {
    response.render('index.ejs');
})

const connection = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'Haido29904@'
});

connection.connect((err) => {
    if(err) throw err;
    console.log('Connected to MySQL');
});