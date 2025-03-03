import userModel from "../models/user.model.js";

export const createUser = async ({
    email, password
}) => {
    if (!email || !password) {
        throw new Error('Email and Password are required');
    }

    const hashedPassword = await userModel.hashPassword(password)

    const user = await userModel.create({
        email, password: hashedPassword
    });

    return user;
}

export const getAllUsers = async()=>{
    const users = await userModel.find();
    return users;
}