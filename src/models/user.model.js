const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    name:{
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            trim:true
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},{timestamps:true});

const userModel=mongoose.model("user",userSchema);
module.exports=userModel;