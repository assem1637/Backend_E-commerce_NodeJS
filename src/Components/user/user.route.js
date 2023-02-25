import { Router } from 'express';
import { uploadSingleImage } from '../../Utils/uploadImage.js';
import { getAllUsers, createUser, getSpecificUser, updateSpecificUser, deleteSpecificUser } from './user.service.js';
import { signup, signin, confirmation } from './user.auth.js';





const router = Router();



router.route("/").get(getAllUsers).post(uploadSingleImage("profileImg"), createUser);
router.route("/:id").get(getSpecificUser).put(uploadSingleImage("profileImg"), updateSpecificUser).delete(deleteSpecificUser);

router.post("/signup", uploadSingleImage("profileImg"), signup);
router.post("/signin", signin);
router.get("/confirm/:token", confirmation);



export default router;