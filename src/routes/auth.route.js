const express=require("express");
const userSchemaValidation=require("../middlewares/userSchemaValidation.middleware");
const {registerUser, loginUser,aboutMe,logoutUser}=require("../controllers/auth.controller");
const {authUser}=require("../middlewares/auth.middleware");

const authRouter=express.Router();

authRouter.post("/register",userSchemaValidation,registerUser);
authRouter.post("/login",loginUser);
authRouter.get("/me",authUser,aboutMe);
authRouter.post("/logout",authUser,logoutUser);

module.exports=authRouter;