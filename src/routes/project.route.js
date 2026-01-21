const express=require("express");
const {authUser}=require("../middlewares/auth.middleware");
const {createProject, getAllProjects, getProjectById, addMember, removeMember}=require("../controllers/project.controller");

const projectRouter=express.Router();

projectRouter.post("/",authUser,createProject);
projectRouter.get("/",authUser,getAllProjects);
projectRouter.post("/:id/members",authUser,addMember);
projectRouter.get("/:id",authUser,getProjectById);
projectRouter.delete("/:id/members",authUser,removeMember);

module.exports=projectRouter;