import { Router } from 'express';
import { uploadSingleImage } from '../../Utils/uploadImage.js';
import { getAllUsers, createUser, getSpecificUser, updateSpecificUser, deleteSpecificUser, changePassword } from './user.service.js';
import { signup, signin, confirmation, Authentication, Authorization, forgetPassword, verifyResetCode, changePasswordAfterConfirmResetCode } from './user.auth.js';
import validation from '../../Utils/validation.js';




const router = Router();



router.route("/").get(Authentication, Authorization(["admin"]), getAllUsers).post(Authentication, Authorization(["admin"]), uploadSingleImage("profileImg"), createUser);
router.route("/:id").get(getSpecificUser).put(Authentication, Authorization(["admin", "user"]), uploadSingleImage("profileImg"), updateSpecificUser).delete(Authentication, Authorization(["admin"]), deleteSpecificUser);

router.post("/signup", validation, uploadSingleImage("profileImg"), signup);
router.post("/signin", signin);
router.get("/confirm/:token", confirmation);
router.put("/changePassword/:id", Authentication, Authorization(["admin"]), changePassword);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.post("/changePasswordAfterConfirmResetCode", changePasswordAfterConfirmResetCode);


export default router;