const jwt=require("jsonwebtoken");
const userModel=require("../models/user.model");
const ExpressError=require("../utils/ExpressError.util");
const bcrypt=require("bcrypt");

module.exports.registerUserService=async(firstName,lastName,email,password)=>{
    const user=await userModel.findOne({email});
    if(user){
        throw new ExpressError("User already exits",409);
    }
    const rounds=10;
    const hashedPassword=await bcrypt.hash(password,rounds);

    const newUser=await userModel.create({
        name:{
            firstName,
            lastName
        },
        email,
        password:hashedPassword
    })
    return newUser;
}

module.exports.loginUserService=async(email,password)=>{
    const user=await userModel.findOne({email}).select("+password");
    if(!user){
        throw new ExpressError("Invalid credentials",401);
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new ExpressError("Invalid credentials",401);
    }
    return user;
}

module.exports.generateToken=(user)=>{
    const token=jwt.sign({
        userId:user._id,
        email:user.email,
        name:{
            firstName:user.name.firstName,
            lastName:user.name.lastName
        }
    },
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
    )
    return token;
}