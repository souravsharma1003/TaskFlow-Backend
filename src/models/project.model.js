const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    },
    description:{
        type:String
    },
    members:[{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    }]
},{timestamps:true});

const projectModel=mongoose.model("project",projectSchema);

module.exports=projectModel;