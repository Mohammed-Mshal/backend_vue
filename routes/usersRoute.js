import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getSpecificUser, updateUser } from "../controllers/userControllers.js";
import multer from "multer";
const router = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.route('/').get(getAllUsers).post(upload.single('avatar'), createUser)
router.route('/:id').delete(deleteUser).get(getSpecificUser).patch(updateUser)

export default router  