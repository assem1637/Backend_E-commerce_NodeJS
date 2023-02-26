import { Router } from 'express';
import { getAllCoupons, createCoupon, getSpecificCoupon, updateSpecificCoupon, deleteSpecificCoupon } from './coupon.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();


router.route("/").get(Authentication, Authorization(["admin"]), getAllCoupons).post(Authentication, Authorization(["admin"]), createCoupon);
router.route("/:id").get(Authentication, Authorization(["admin"]), getSpecificCoupon).put(Authentication, Authorization(["admin"]), updateSpecificCoupon).delete(Authentication, Authorization(["admin"]), deleteSpecificCoupon);




export default router;
