const {createProjectService,getProjectsService, getProjectByIdService, addMemberService, removeMemberService}=require("../services/project.service");
const wrapAsync=require("../utils/wrapAsync.util");
const userModel=require("../models/user.model");

module.exports.createProject=wrapAsync(async(req,res)=>{
    const {title,description}=req.body;
    const ownerId=req.user.userId;

    const project=await createProjectService(title,description,ownerId);

    res.status(201).json(project);
})

module.exports.getAllProjects=wrapAsync(async(req,res)=>{
    const userId=req.user.userId;
    const projects=await getProjectsService(userId);
    res.status(200).json(projects);
})

module.exports.getProjectById=wrapAsync(async(req,res)=>{
    const userId=req.user.userId;
    const projectId=req.params.id;
    const project=await getProjectByIdService(projectId,userId);
    res.status(200).json(project);
})

module.exports.addMember=wrapAsync(async(req,res)=>{
    const{email}=req.body;
    const ownerId=req.user.userId;
    const projectId=req.params.id;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updateProject=await addMemberService(projectId,ownerId,user._id);
    res.status(200).json(updateProject);
})

module.exports.removeMember=wrapAsync(async(req,res)=>{
    const{id}=req.params;
    const {email}=req.body;
    const ownerId=req.user.userId;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const project=await removeMemberService(id,ownerId,user._id);
    res.status(200).json(project);
})