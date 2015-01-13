var express = require("express");
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.setup = function() {
    var router = express.Router();
    
    router.get('/',function(req,res,next){//index route
        res.render('index', {
            title: "Codex"
        });
    });
    
    router.get('/about',function(req,res,next){//about us route
        res.render('about', {
            title: "Codex"
        });
    });
    
    return router;
};