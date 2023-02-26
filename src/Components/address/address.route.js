import { Router } from 'express';
import { getUserAddress, addAddress, updateAddress, deleteAddress } from './address.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';





const router = Router();


router.route("/").get(Authentication, Authorization(["user"]), getUserAddress).post(Authentication, Authorization(["user"]), addAddress);
router.route("/:id").put(Authentication, Authorization(["user"]), updateAddress).delete(Authentication, Authorization(["user"]), deleteAddress);



export default router;
