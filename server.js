const express = require("express");
const app = express();
const port= 3000;
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
var campgrounds =[
    {name:"salmon creek", image:"https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name:"mountain goats", image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name:"silver creeks", image:"https://pixabay.com/get/52e7d2424a57ac14f1dc84609620367d1c3ed9e04e50744070297ddc9045c0_340.jpg"},
]

app.get("/", function(req,res){
res.render("landing");
});

app.get("/campgrounds", function(req,res){

    res.render("campgrounds",{campgrounds:campgrounds});
})

app.post("/campgrounds", function(req,res){
    
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name:name,image:image};
    campgrounds.push(newCampground);
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

app.listen(port,function(){
    console.log(`server listening on ${port}` );
});