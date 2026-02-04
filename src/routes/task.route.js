const express=require("express");
const { authUser } = require("../middlewares/auth.middleware");
const { createTask, getTask, updateTaskStatus, deleteTask, reAssign } = require("../controllers/task.controller");
const validateTaskSchema = require("../middlewares/taskSchemaValidation.middleWare");
const validateUpdateTaskSchema = require("../middlewares/updateTaskValidation.middleware");
const validateReassignTask = require("../middlewares/taskReassignSchemaValidation.middleware");

const taskRouter=express.Router({mergeParams:true});

taskRouter.post("/",authUser,validateTaskSchema,createTask);
taskRouter.get("/",authUser,getTask);
taskRouter.patch("/:taskId/assign",authUser,validateReassignTask,reAssign);
taskRouter.patch("/:taskId/status",authUser,validateUpdateTaskSchema,updateTaskStatus);
taskRouter.delete("/:taskId",authUser,deleteTask);


module.exports=taskRouter;