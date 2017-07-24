var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var passport = require('passport');
var bcrypt = require("bcrypt-nodejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());

app.use(session({
		secret: process.env.SESSION_SECRET || "This is secret code",
		resave: true,
		saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

// configure a public directory to host static content
app.use(express.static(__dirname + '/public/assignment'));

// require ("./test/app.js")(app);
require("./assignment/app.js")(app);

var port      = process.env.PORT || 3000;
var ipaddress = process.env.IP;
console.log('Hello! Server running on 127.0.0.1:3000');

app.listen(port, ipaddress);
