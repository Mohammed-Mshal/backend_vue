import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getSpecificUser, updateUser } from "../controllers/userControllers.js";

const router= Router()

router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').delete(deleteUser).get(getSpecificUser).patch(updateUser)

export  default router  