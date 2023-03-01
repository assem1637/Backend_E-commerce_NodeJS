import { Router } from 'express';
import { getAllOrders, createOrder, paymentWithCash } from './order.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';






const router = Router();



router.route("/").get(getAllOrders).post(Authentication, Authorization(["user"]), createOrder);
router.route("/:id").post(Authentication, Authorization(["user"]), paymentWithCash);




export default router;