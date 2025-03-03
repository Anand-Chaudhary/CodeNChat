import projectModel from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, userId }) => {
    if (!name) {
        throw new Error('Project name is required');
    }
    if (!userId) {
        throw new Error('User is required');
    }

    const project = await projectModel.create({
        name,
        users: [userId]
    });
    return project;
};

export const getAllProjects = async (userId) => {
    if (!userId) {
        throw new Error('User is required');
    }

    const allUserProjects = await projectModel.find({ users: userId });
    return allUserProjects;
};

export const addUserToProject = async ({ projectId, users, userId }) => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error('Invalid project ID');
    }

    if (!users || !users.length) {
        throw new Error('Users must be an array of strings');
    }

    users.forEach(user => {
        if (!mongoose.Types.ObjectId.isValid(user)) {
            throw new Error(`Invalid user ID: ${user}`);
        }
    });

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('User is required');
    }

    const project = await projectModel.findById({
        _id: projectId,
        users: userId
    });

    if (!project) {
        throw new Error('User does not belong to this project');
    }

    const updatedProject = await projectModel.findOneAndUpdate(
        {
            _id: projectId
        },
        {
            $addToSet: {
                users: {
                    $each: users
                }
            }
        },
        {
            new: true
        }
    )
    return updatedProject;
}