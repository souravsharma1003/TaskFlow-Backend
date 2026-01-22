const {createTaskService, getTasksService, updateTaskStatusService, deleteTaskService, reAssignService}=require("../services/task.service");
const wrapAsync=require("../utils/wrapAsync.util")

module.exports.createTask=wrapAsync(async(req,res)=>{
    const {title}=req.body;
    const {userId}=req.user;
    const {projectId}=req.params;

    const task=await createTaskService(title,projectId,userId);
    res.status(201).json(task);
})

module.exports.getTask=wrapAsync(async(req,res)=>{
    const userId=req.user.userId;
    const {projectId}=req.params;
    const{page=1,limit=10}=req.query;
    const {tasks,totalTasks,totalPages}=await getTasksService(projectId,userId,page,limit);
    res.status(200).json({
        tasks,
        pagination:{
            totalTasks,
            currentPage:page,
            totalPages
        }
    });
})

module.exports.updateTaskStatus=wrapAsync(async(req,res)=>{
    const {userId}=req.user;
    const {taskId}=req.params;
    const {status}=req.body;
    const task=await updateTaskStatusService(userId,taskId,status);
    res.status(200).json(task);
})

module.exports.deleteTask=wrapAsync(async(req,res)=>{
    const {userId}=req.user;
    const {taskId}=req.params;

    await deleteTaskService(taskId,userId);
    res.status(200).json({message:"Task deleted successfully"});
})

module.exports.reAssign=wrapAsync(async(req,res)=>{
    const{taskId}=req.params;
    const {assigneeId}=req.body;
    const {userId}=req.user;
    const task=await reAssignService(taskId,assigneeId,userId);
    res.status(200).json(task);
})