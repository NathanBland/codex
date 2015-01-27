var express = require("express");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
//var OAuth2Strategy = require('passport-oauth2').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/User.js');
exports.setup = function(app) {
    var router = express.Router();
    
    //#################
    //Strageties
    //#################
    //#################
    //Google
    //#################
    passport.use(new GoogleStrategy({
            authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
            tokenURL: 'https://accounts.google.com/o/oauth2/token',
            clientID: '13732950225-rdk5k61d20m87mlbgbde1fu3rlg5e3rh.apps.googleusercontent.com',
            clientSecret: 'krkA9BvQ3p6qkjlAHD0bq7jK',
            callbackURL: 'https://codex-nathanbland.c9.io/login/google/callback',
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({
                    'google.id': profile.id
                }, function(err, user) {
                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        newUser.save(function(err) {
                            if (err) {
                                
                                throw (err);
                            }
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
    //#################
    //End Google
    //#################
    
    //#################
    //twitter
    //#################
    passport.use(new TwitterStrategy({
        consumerKey: 'Q2ctAJQDoSUmHKvYOqF72LReV',
        consumerSecret: 'rue9W9PXPiUdNkNhIhUdn3qlA7lYvTpkHC7D3uEZ3QxEll1FNM',
        callbackURL: "https://codex-nathanbland.c9.io/login/twitter/callback"
    }, function(token, tokenSecret, profile, done) {
        
        process.nextTick(function() {
            User.findOne({
                'twitter.id': profile.id
            }, function(err, user) {
                if (err)
                    return done(err);
                if (user) {
                    return done(null, user);
                }
                else {
                    var newUser = new User();
                    newUser.twitter.id = profile.id;
                    newUser.twitter.token = token;
                    newUser.twitter.username = profile.username;
                    newUser.twitter.displayName = profile.displayName;
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
    //#################
    //endtwitter
    //#################
    
    //#################
    //Local
    //#################
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    router.use(passport.initialize());
    router.use(passport.session());
    router.use(function(req, res, next) {
        var user = req.user;
        if (user) {
            res.locals.user = {
                username: user.username
            };
        }
        next();
    });
    router.get('/signup', function(req, res) {
        res.render('signup', {
            title: "Codex - Create an account"
        });
    });
    router.post('/signup', function(req, res) {
        if (req.body.password != req.body.password2) {
            return res.render('signup', {
                title: "Codex - Create an account",
                notification: {
                    severity: "error",
                    message: "Failed to register user: Passwords did not match!"
                },
            });
        }
        
        User.register(new User({
            username: req.body.username,
        }), req.body.password, function(err, user) {
            if (err) {
                
                return res.render('signup', {
                    title: "Codex - Create an account",
                    notification: {
                        severity: "error",
                        message: "Failed to register user: " + err.message
                    },
                    user: user
                });
            }

            passport.authenticate('local')(req, res, function() {
                res.redirect('/contacts');
            });
        });
    });
    //#################
    //End Local
    //#################
    //#################
    //End Strageties
    //#################
    
    //#################
    //twitter
    //#################
    router.get('/login/twitter', passport.authenticate('twitter'));
    router.get('/login/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
        }));
    //#################
    //endtwitter
    //#################
    //#################
    //Google
    //#################
    router.get('/login/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    
    // the callback after google has authenticated the user
    router.get('/login/google/callback',
        passport.authenticate('google', {
            successRedirect: '/dashboard',
            failureRedirect: '/login'
        }));
    //#################
    //End Google
    //#################
    
    //#################
    //Local
    //#################
    router.get('/login', function(req, res) {
        res.render('login', {
            title: "Codex - Log in",
            user: req.user
        });
    });
    router.post('/login', function(req, res, next) {
        
        passport.authenticate('local', function(err, user, info) {
        
            if (err) {
                return next(err);
            }
            if (!user) {
        
                return res.render('login', {
                    title: "Codex - Log in",
                    notification: {
                        severity: 'error',
                        message: "Your username or password is wrong. Try again."
                    }
                });
            }
            // Log the user in and redirect to the homepage.
            req.login(user, function(err) {
        
                if (err) {
                    return next(err);
                }
                return res.redirect('/contacts');
            });
        })(req, res, next); /**/
    });
    //#################
    //End Local
    //#################
    
    // Log the user out and redirect to the homepage.
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    return router;
};