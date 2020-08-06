var mongoose = require("mongoose");

// schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    createdAt: { type: Date, default: Date.now },
    description: String,
    author :{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground", campgroundSchema);
