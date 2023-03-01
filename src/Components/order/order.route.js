import { Router } from 'express';
import { getAllOrders, paymentWithCash, updatePay, updateDelivery } from './order.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';






const router = Router();



router.route("/").get(getAllOrders).post(Authentication, Authorization(["user"]), paymentWithCash);
router.put("/updatePay/:id", Authentication, Authorization(["admin"]), updatePay);
router.put("/updateDeliverd/:id", Authentication, Authorization(["admin"]), updateDelivery);




export default router;