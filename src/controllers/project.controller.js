const {createProjectService,getProjectsService, getProjectByIdService, addMemberService, removeMemberService}=require("../services/project.service");
const wrapAsync=require("../utils/wrapAsync.util");

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
    const{memberId}=req.body;
    const ownerId=req.user.userId;
    const projectId=req.params.id;
    const updateProject=await addMemberService(projectId,ownerId,memberId);
    res.status(200).json(updateProject);
})

module.exports.removeMember=wrapAsync(async(req,res)=>{
    const{projectId}=req.params;
    const {memberId}=req.body;
    const ownerId=req.user.userId;
    const project=await removeMemberService(projectId,ownerId,memberId);
    res.status(200).json(project);
})