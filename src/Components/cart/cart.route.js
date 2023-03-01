import { Router } from 'express';
import { addToCart, getAllCarts, updateQuantity, deleteFromCart, cartOfUser, applyCoupon } from './cart.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';






const router = Router();


router.route("/").get(getAllCarts).post(Authentication, Authorization(["user"]), addToCart);
router.route("/:id").patch(Authentication, Authorization(["user"]), updateQuantity).delete(Authentication, Authorization(["user"]), deleteFromCart);
router.get("/cartOfUser", Authentication, Authorization(["user"]), cartOfUser);
router.post("/applyCoupon", Authentication, Authorization(["user"]), applyCoupon);

export default router;