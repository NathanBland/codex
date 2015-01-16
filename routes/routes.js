var express = require("express");
var ensureLogin = require('connect-ensure-login');
var hl = require('highlight.js');
var Codes = require('../models/Code');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.setup = function() {
    var router = express.Router();

    router.all('/dashboard', ensureAuthenticated('/login'));
    router.all('/dashboard/*', ensureAuthenticated('/login'));
    router.all('/code/add', ensureAuthenticated('/login'));

    router.get('/', function(req, res, next) { //index route
        res.render('index', {
            title: "Codex"
        });
    });

    router.get('/about', function(req, res, next) { //about us route
        res.render('about', {
            title: "Codex"
        });
    });
    router.get('/dashboard', function(req, res, next) { //about us route
        Codes.find().sort('-1').exec(function(err, codes){
            console.log(codes);
            res.render('dashboard', {
                title: "Codex",
                feed: codes
            });
        })
        
    });
    //##############
    //End Main Nav.
    //##############

    router.post('/code/add', saveNew);

    function saveNew(req, res, next) {
        if (!req.user) {
            return res.redirect('/login');
        }
        var code = req.user.newCode();
        //console.log(req.body);
        if (req.body.code === "" || req.body.code.length < 1) {
            return res.status(400).send("bad request");
        }

        //highlight with highlight.js. No idea if this works.
        var newCode = req.body.code;
        newCode = newCode.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");
        newCode = newCode.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");
        newCode = hl.highlightAuto(req.body.code);
        console.log(newCode);
        
        code.set({
            title: req.body.title || '',
            code: newCode.value,
            lang: newCode.language
        });
        code.save(function(err) {
            if (err) {
                res.status(500).send("Server error");
            }
            else {
                res.redirect('/dashboard');
            }
        });
    }

    return router;
};