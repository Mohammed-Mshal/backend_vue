import mongoose from "mongoose";
import asyncWrapper from "../lib/asyncWrapper.js";
import { usersModel } from "../models/usersModel.js";
import imagekit from "../lib/imageKit.js";

const createUser = asyncWrapper(async (req, res) => {

    const name = req && req?.body?.name;
    const username = req && req?.body?.username;
    const email = req && req?.body?.email;
    const website = req && req?.body?.website;
    const phone = req && req?.body?.phone;
    const avatar = req && req.file
    if (!name || !username || !email || !website || !phone || !avatar) {
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
    if (avatar?.size === 0) {
        return res.status(400).json({
            success: false,
            message: "Image Not Valid",
        });
    }
    if (!avatar?.mimetype.startsWith('image')) {
        return res.status(400).json({
            success: false,
            message: "File Should Be Image",
        });

    }
    const isEmailExist = await usersModel.findOne({
        email,
    });
    if (isEmailExist) {
        return res.status(404).json({
            message: "Email Already Exist",
            success: false,
        });
    }
    const imageUploaded = await imagekit.upload({
        file: Buffer.from(avatar?.buffer),
        useUniqueFileName: true,
        fileName: 'user',
        folder: 'vue_projects/users',
    })
    const newUser = await usersModel.create({
        name,
        username,
        email,
        phone,
        website,
        image: imageUploaded.url,
        imageId: imageUploaded.fileId
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
    const userInfo = await usersModel.findById(idUser);
    if (!userInfo) {
        return res.status(404).json({
            message: "User Is Not Exist",
            success: false,
        });
    }
    if (userInfo.imageId) {
        await imagekit.deleteFile(userInfo.imageId)
    }
    await usersModel.deleteOne({
        _id: userInfo._id,
    });
    return res.status(200).json({
        message: "User Deleted Complete",
        success: true,
    });
});
const getAllUsers = asyncWrapper(async (req, res) => {
    const users = await usersModel.find({});
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
    const userInfo = await usersModel.findById(idUser);
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
    const userInfo = await usersModel.findById(userId)
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
        const isNewEmailUsed = await usersModel.find({
            email
        })
        if (isNewEmailUsed.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email Already Used"
            })
        }
    }
    await usersModel.updateOne({
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
