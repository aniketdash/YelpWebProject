
var express = require("express");
var router = express.Router();
const passport = require("passport");

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");


router.get("/", function(req,res){
    res.render("landing");
    });
    //=============
    //auth routes
    //=============
    
    router.get("/register", function(req,res){
        res.render("register",{page:'register'});
    });
    
    router.post("/register", function(req,res){
        var newUser = new User({username: req.body.username});
        User.register(newUser,req.body.password, function(err, user){
            if(err){
                console.log(err);
                return res.render("register", {error: err.message});
            }
            passport.authenticate("local")(req,res,function(){
                req.flash("success","welcome to yelp camp "+user.username);
                res.redirect("/campgrounds");
            });
        });
    });
    
    // show login form
    router.get("/login", function(req,res){
        res.render("login.ejs",{page:'login'});
    });
    
    router.post("/login", passport.authenticate("local",
        {
            successRedirect: "/campgrounds",
            failureRedirect: "/login"
        }), function(req,res){
    
    });
    
    //logout route
    router.get("/logout", function(req,res){
        req.logout();
        req.flash("success","Logged you out");
        res.redirect("/campgrounds");
    });
    
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }

    module.exports= router;