import { Router } from 'express';
import { getAllOrders, paymentWithCash, ordersOfUser, updatePay, updateDelivery, checkoutSession, paymentWithStripe } from './order.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';






const router = Router();



router.route("/").get(Authentication, Authorization(["admin"]), getAllOrders).post(Authentication, Authorization(["user"]), paymentWithCash);
router.get("/ordersOfUser", Authentication, Authorization(["user"]), ordersOfUser);
router.get("/checkoutSession", Authentication, Authorization(["user"]), checkoutSession);
router.get("/paymentWithStripe/:token", paymentWithStripe);
router.put("/updatePay/:id", Authentication, Authorization(["admin"]), updatePay);
router.put("/updateDeliverd/:id", Authentication, Authorization(["admin"]), updateDelivery);




export default router;