import * as projectService from "../services/project.service.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ message: errors.array()[0].msg });
    }
    try {
        const loggedinUser = await User.findOne({ email: req.user.email })
        const userData = {
            name: req.body.name,
            userId: loggedinUser._id
        };

        const project = await projectService.createProject({ name: userData.name, userId: userData.userId });
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send({ message: error.message });
        console.log(error.message);
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const loggedinUser = await
            User.findOne({ email: req.user.email });
        const allUserProjects = await projectService.getAllProjects(loggedinUser._id);
        return res.status(200).send({ allUserProjects });
    } catch (error) {
        res.status(404).send({ message: error.message });
        console.log(error.message);
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ message: errors.array()[0].msg });
    };
    try {
        const { projectId, users } = req.body;
        const loggedinUser = await User.findOne({ email: req.user.email });
        const project = await projectService.addUserToProject({
            projectId, users, userId: loggedinUser._id
        });
        return res.status(200).json({ project });
    } catch (err) {
        res.status(400).send({ message: err.message });
        console.log(err.message);

    }
}

export const getProjectById = async (req, res) => {

    const  projectId  = req.params;

    try {

        const project = await projectService.getProjectById(projectId );

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}