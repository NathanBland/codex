var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var routes = require('./routes/');

var app = express(); //use express.

nunjucks.configure('views', {//setting up our templating engine 
    autoescape: true,
    express: app
});

app.set('port', process.env.PORT || 1337);// telling c9 where our app runs.
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public')); //static folder for things like css

app.use(bodyParser.urlencoded({ //make user input safe
    extended: false
}));

app.use(cookieParser('Secret secret, I have a secret')); //things to track the user
app.use(session({
    secret: 'Now once upon a time, there was a secret that was hidden.',
    resave: true,
    saveUninitialized: true
}));

app.use(routes.setup(app)); //setup them routes