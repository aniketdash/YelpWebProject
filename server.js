const express = require("express");
const app = express();
const port= 3000;
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seed");




//mongo db connection using mongoose
mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

//seedDB();

// Campground.create(
//     {
//         name:"mountain goats", 
//         image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350",
//         description:"The land of the mountains and goats"
//     }, function(err, campground){
//         if(err){ 
//             console.log(err);
//         }
//         else{
//             console.log("New Campground");
//             console.log(campground);
//         }
//     });


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.use(require("express-session")({
    secret: "there are no secrets",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


app.get("/", function(req,res){
res.render("landing");
});

app.get("/campgrounds", function(req,res){
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

app.post("/campgrounds", function(req,res){
    
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name:name,image:image,description:desc};
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

app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){
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

//================
// Comment Routes
//================

app.get("/campgrounds/:id/comments/new" ,isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            // create new comment
           Comment.create(req.body.comment, function(err,comment){
               if(err){
                   console.log(err);
               }else{
                   // connect new comment to campground
                   campground.comments.push(comment);
                   campground.save();
                   // redirect
                   res.redirect('/campgrounds/'+ campground._id);
               }
           });
        }
    });
    
    
    
});

//=============
//auth routes
//=============

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req,res){
    res.render("login.ejs");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req,res){

});

//logout route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(port,function(){
    console.log(`server listening on ${port}` );
});