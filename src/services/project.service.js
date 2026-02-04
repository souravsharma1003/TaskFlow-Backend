const projectModel = require("../models/project.model");
const ExpressError = require("../utils/ExpressError.util");

module.exports.createProjectService = async (title, description, ownerId) => {
    const project = await projectModel.create({
        title,
        description,
        owner: ownerId
    })

    return project;
}

module.exports.getProjectsService = async (userId) => {
    const projects = await projectModel.find({
        $or: [
            { owner: userId },
            { members: userId }
        ]
    });

    return projects;
}

module.exports.getProjectByIdService = async (projectId, userId) => {
    const project = await projectModel.findById(projectId).populate("members", "-password").populate("owner", "-password");

    if (!project) {
        throw new ExpressError("Project not found", 404);
    }

    const isOwner = project.owner._id.equals(userId);

    const isMember = project.members.some(
        member => member._id.equals(userId)
    );

    if (!isOwner && !isMember) {
        throw new ExpressError("Forbidden", 403);
    }

    return project;
};

module.exports.addMemberService = async (projectId, ownerId, memberId) => {
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new ExpressError("Project not found", 404);
    }

    if (!project.owner.equals(ownerId)) {
        throw new ExpressError("Unauthorized", 403);
    }

    let alreadyMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(memberId)) {
            alreadyMember = true;
            break;
        }
    }
    if (alreadyMember) {
        throw new ExpressError("Already exists", 400);
    }
    project.members = [...project.members, memberId];
    await project.save();
    return await project.populate("members", "-password");
}

module.exports.removeMemberService = async (projectId, ownerId, memberId) => {
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new ExpressError("Project not found", 404);
    }
    const isOwner = project.owner.equals(ownerId);
    if (!isOwner) {
        throw new ExpressError("Unauthorized", 403);
    }
    let isMember = false;
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i].equals(memberId)) {
            isMember = true;
            break;
        }
    }
    if (!isMember) {
        throw new ExpressError("Member don't exist", 400);
    }
    project.members = project.members.filter(item =>
        !item.equals(memberId)
    )
    await project.save();
    return project;
}