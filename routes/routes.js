var express = require("express");
var ensureLogin = require('connect-ensure-login');
var hl = require('highlight.js');
var Codes = require('../models/Code');
var Users = require('../models/User');
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
    router.get('/purpose', function(req, res, next) { //slash purpose route
        res.render('purpose', {
            title: "Codex"
        });
    });
    router.get('/dashboard', function(req, res, next) { //about us route

        console.log(req.user);
        Codes.find()
            .sort({
                _id: -1
            })
            .populate('user_id')
            .exec(function(err, codes) {
                //console.log(codes);
                if (err) return next(err);
                res.render('dashboard', {
                    title: "Codex",
                    feed: codes,
                    user: req.user
                });
            })

    });
    router.get('/code/:id', function(req, res, next) {
        Codes.findOne({
                _id: req.params.id
            })
            .sort()
            .populate('user_id')
            .exec(function(err, code) {
                if (err) {
                    return res.status(400).send("Bad Request");
                }
                
                res.render('code', {
                    title: code.title,
                    code: code
                });
            });
    });
    router.get('/lang/:name', function(req, res, next) {
        Codes.find({
                lang: req.params.name
            })
            .sort({
                _id: -1
            })
            .populate('user_id')
            .exec(function(err, code) {
                if (err) {
                    return res.status(400).send("Bad Request");
                }
                res.render('publicFeed', {
                    title: req.params.name,
                    feedType: 'lone',
                    feed: code
                });
            });
    });
    router.get('/user/:name', function(req, res, next) {
        Users.findOne({
                username: req.params.name
            })
            .sort()
            .exec(function(err, user) {
                if (err) {
                    return res.status(400).send("Bad Request");
                }
                console.log(user);
                Codes.find({
                        user_id: user._id
                    })
                    .sort({
                        _id: -1
                    })
                    .populate('user_id')
                    .exec(function(err, codes) {
                        if (err) {
                            return res.status(400).send("Bad Request");
                        }
                        console.log(codes);
                        res.render('profile', {
                            title: req.params.name,
                            profile: user,
                            feed: codes
                        });
                    });
            });
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
        //console.log(newCode);//prints highlighted things.

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
                res.status(200).send(res.req.body);
                console.log(res.req.body);
            }
        });
    }

    //#################
    //MISC
    //#################
    router.post('/user/addUserName', setUsername);

    function setUsername(req, res, next) {
            if (!req.user) {
                return res.redirect('/login');
            }
            if (req.user.username) {
                return res.redirect('/dashboard');
            }
            var user = req.user;
            user.set({
                username: req.body.username
            })

            user.save(function(err) {
                if (err)
                    throw err;
                if (err) {
                    res.status(500).send("Server error");
                }
                else {
                    res.status(200).send(res.req.body);
                    console.log(res.req.body);
                }
            });
        }
        //#################
        //End MISC
        //#################
    return router;
};