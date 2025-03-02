import projectModel from "../models/project.model.js";
import * as projectService from "../services/project.service.js";
import User from "../models/user.model.js";
import {validationResult} from "express-validator";

export const createProject = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send({message: errors.array()[0].msg});
    }
    try {
        const loggedinUser = await User.findOne({email: req.user.email})
        const userData = {
            name: req.body.name,
            userId: loggedinUser._id
        };

        const project = await projectService.createProject({name: userData.name, userId: userData.userId});
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send({message: error.message});
        console.log(error.message);
    }
}