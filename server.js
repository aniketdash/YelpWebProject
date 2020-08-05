const express = require("express");
const app = express();
const port= 3000;
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seed");


//routes
var commentRoutes= require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes= require("./routes/index");




//mongo db connection using mongoose
mongoose.connect('mongodb://localhost:27017/yelp_camp_v1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
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
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);




app.listen(port,function(){
    console.log(`server listening on ${port}` );
});