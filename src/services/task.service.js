const taskModel = require("../models/task.model");
const projectModel = require("../models/project.model");
const ExpressError = require("../utils/ExpressError.util");

module.exports.createTaskService = async (title, projectId, userId) => {
    const project = await projectModel.findById(projectId);

    if (!project) {
        throw new ExpressError("Project not found", 404);
    }

    const isOwner = project.owner.equals(userId);

    let isMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(userId)) {
            isMember = true;
            break;
        }
    }

    if (!isOwner && !isMember) {
        throw new ExpressError("Forbidden", 403);
    }

    const task = await taskModel.create({
        title,
        project: projectId,
        assignedTo: userId
    });

    return task;
};

module.exports.getTasksService = async (projectId, userId, page, limit) => {
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new ExpressError("Not found", 404);
    }
    const isOwner = project.owner.equals(userId);
    let isMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(userId)) {
            isMember = true;
            break;
        }
    }
    if (!isOwner && !isMember) {
        throw new ExpressError("Forbidden", 403);
    }
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;
    const tasks = await taskModel.find({ project: projectId }).populate("assignedTo", "-password").skip(skip).limit(limit);
    const totalTasks = await taskModel.countDocuments({
        project: projectId
    });
    const totalPages = Math.ceil(totalTasks / limit);
    return { tasks, totalTasks, totalPages };
}

module.exports.updateTaskStatusService = async (userId, taskId, status) => {
    const task = await taskModel.findById(taskId);

    if (!task) {
        throw new ExpressError("Task not found", 404);
    }

    const project = await projectModel.findById(task.project);

    if (!project) {
        throw new ExpressError("Project not found", 404);
    }

    const isOwner = project.owner.equals(userId);

    let isMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(userId)) {
            isMember = true;
            break;
        }
    }

    if (!isOwner && !isMember) {
        throw new ExpressError("Forbidden", 403);
    }

    task.status = status;
    await task.save();
    const populatedTask = await task.populate("assignedTo", "-password");
    return populatedTask;
};

module.exports.deleteTaskService = async (taskId, userId) => {
    const task = await taskModel.findById(taskId);
    if (!task) {
        throw new ExpressError("Task Not found", 404);
    }
    const project = await projectModel.findById(task.project);
    if (!project) {
        throw new ExpressError("Project Not found", 404);
    }
    const isOwner = project.owner.equals(userId);

    let isMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(userId)) {
            isMember = true;
            break;
        }
    }

    if (!isOwner && !isMember) {
        throw new ExpressError("Forbidden", 403);
    }
    await taskModel.findByIdAndDelete(taskId);
}

module.exports.reAssignService = async (taskId, assigneeId, userId) => {
    const task = await taskModel.findById(taskId);
    if (!task) {
        throw new ExpressError("Task not found", 404);
    }
    const project = await projectModel.findById(task.project);
    if (!project) {
        throw new ExpressError("Project not found", 404);
    }
    const isOwner = project.owner.equals(userId);
    const isTaskCreator = task.assignedTo.equals(userId);

    if (!isOwner && !isTaskCreator) {
        throw new ExpressError("Unauthorized", 403);
    }
    let isMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(assigneeId)) {
            isMember = true;
            break;
        }
    }
    if (!isMember && !project.owner.equals(assigneeId)) {
        throw new ExpressError("Invalid assignee", 400);
    }
    task.assignedTo = assigneeId;
    await task.save();
    const populatedTask = await task.populate("assignedTo", "-password");
    return populatedTask;
}