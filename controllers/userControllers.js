import mongoose from "mongoose";
import asyncWrapper from "../lib/asyncWrapper.js";
import { userModel } from "../models/usersModel.js";

const createUser = asyncWrapper(async (req, res) => {
    const { name, username, email, website, phone } = req.body;
    if (!name || !username || !email || !website || !phone) {
        return res.status(400).json({
            success: false,
            message: "Missing Field",
        });
    }
    if (name.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Name Should Be equal or More Than 3 Character",
        });
    }
    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Username Should Be equal or More Than 3 Character",
        });
    }
    const isEmailExist = await userModel.findOne({
        email,
    });
    if (isEmailExist) {
        return res.status(404).json({
            message: "Email Already Exist",
            success: false,
        });
    }
    const newUser = await userModel.create({
        name,
        username,
        email,
        phone,
        website,
    });
    return res.status(201).json({
        message: "Create User Completed",
        success: true,
        data: newUser
    });
});
const deleteUser = asyncWrapper(async (req, res) => {
    const idUser = req.params.id;
    if (!idUser) {
        return res.status(404).json({
            message: "User Id is Missing",
            success: false,
        });
    }
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
        return res.status(404).json({
            message: "User Id is Not Valid",
            success: false,
        });
    }
    const userInfo = await userModel.findById(idUser);
    if (!userInfo) {
        return res.status(404).json({
            message: "User Is Not Exist",
            success: false,
        });
    }
    await userModel.deleteOne({
        _id: userInfo._id,
    });
    return res.status(200).json({
        message: "User Deleted Complete",
        success: true,
    });
});
const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await userModel.find({});
    if (users.length === 0) {
        return res.status(204).json({
            message: "No Users",
            success: true,
        });
    }
    return res.status(200).json({
        success: true,
        data: users,
    });
});
const getSpecificUser = asyncWrapper(async (req, res) => {
    const idUser = req.params.id;
    if (!idUser) {
        return res.status(404).json({
            message: "User Id is Missing",
            success: false,
        });
    }
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
        return res.status(404).json({
            message: "User Id is Not Valid",
            success: false,
        });
    }
    const userInfo = await userModel.findById(idUser);
    if (!userInfo) {
        return res.status(404).json({
            message: "User Is Not Exist",
            success: false,
        });
    }
    return res.status(404).json({
        success: true,
        data: userInfo
    });
});
const updateUser = asyncWrapper(async (req, res) => {
    const userId = req.params.id
    const userInfo = await userModel.findById(userId)
    if (!userInfo) {
        return res.status(400).json({
            message: "User Is Not Exist",
            success: false
        })
    }
    const { name, username, email, website, phone } = req.body;
    if (name && name.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Name Should Be equal or More Than 3 Character",
        });
    }
    if (username && username.length < 3) {
        return res.status(400).json({
            success: false,
            message: "Username Should Be equal or More Than 3 Character",
        });
    }
    if (email) {        
        const isNewEmailUsed = await userModel.find({
            email
        })
        if (isNewEmailUsed.length>0) {
            return res.status(400).json({
                success: false,
                message: "Email Already Used"
            })
        }
    }
    await userModel.updateOne({
        _id: userId
    }, {
        name: name || userInfo.name,
        username: username || userInfo.username,
        email: email || userInfo.email,
        phone: phone || userInfo.phone,
        website: website || userInfo.website,
    })
    return res.status(200).json({
        success: true,
        message: "User Updated Success"
    })
});

export { createUser, deleteUser, getAllUsers, getSpecificUser, updateUser };
