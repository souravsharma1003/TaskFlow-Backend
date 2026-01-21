const express=require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { createTask, getTask, updateTaskStatus, deleteTask, reAssign } = require("../controllers/task.controller");

const taskRouter=express.Router();

taskRouter.post("/",authUser,createTask);
taskRouter.get("/",authUser,getTask);
taskRouter.patch("/:taskId/assign",authUser,reAssign);
taskRouter.patch("/:taskId/status",authUser,updateTaskStatus);
taskRouter.delete("/:taskId",authUser,deleteTask);


module.exports=taskRouter;