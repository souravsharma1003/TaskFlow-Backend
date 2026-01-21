const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    project:{
        type:mongoose.Schema.ObjectId,
        ref:"project",
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.ObjectId,
        ref:"user"
    },
    status:{
        type:String,
        enum:["todo","in-progress","done"],
        default:"todo"
    }
},{timestamps:true});

const taskModel=mongoose.model("task",taskSchema);

module.exports=taskModel;