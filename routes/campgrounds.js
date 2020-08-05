var express = require("express");
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
const campground = require("../models/campground");

var middleware= require("../middleware/index.js")

router.get("/campgrounds", function(req,res){
    //get campground from db
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
        }
    })
    //res.render("campgrounds",{campgrounds:campgrounds});
})

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author ={
        id:req.user._id,
        username: req.user.username
    }
    var newCampground = {name:name,image:image,price:price,description:desc,author:author};
    // create and save to db
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
    //redirect back to campgrounds page
    
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req,res){
    //find the campground with the id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
    //show more info
});

//EDIT 
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
            
        res.render("campgrounds/edit",{campground: foundCampground}); 
                
    });
   
    
});

//UPDATE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
}) ;

// Destroy route

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            res.redirect("/campgrounds");
        }
    });
})



module.exports= router;