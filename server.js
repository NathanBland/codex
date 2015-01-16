var express = require('express');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var stylus = require('stylus');
var multer = require('multer');
var routes = require('./routes/');

var app = express(); //use express.


//config and connect to database
app.set('dbhost', process.env.IP || 'localhost');
app.set('dbname', 'codex');

mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'));

//set css preprocessor
app.use(stylus.middleware(__dirname + '/public/css'));


//set view engine

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
nunjucks.configure('views', { //setting up our templating engine 
    autoescape: true,
    express: app,
    watch: true
});

app.set('port', process.env.PORT || 1337); // telling c9 where our app runs.
app.set('ip', process.env.IP || '0.0.0.0');

app.use(express.static('public')); //static folder for things like css

app.use(bodyParser.urlencoded({ //make user input safe
    extended: false
}));

app.use(multer({ dest: './tmp/'})) //need to figure out exactly what this does.
app.use(cookieParser('Secret secret, I have a secret')); //things to track the user
app.use(session({
    secret: 'Now once upon a time, there was a secret that was hidden.',
    resave: true,
    saveUninitialized: true
}));

app.use(routes.setup(app)); //setup them routes

var server = app.listen(app.get('port'), app.get('ip'), function() {
    var address = server.address();
    console.log("Let us share the knowledge of the world.")
    console.log("Codex running on https://%s:%s",
        address.address, address.port);
});
