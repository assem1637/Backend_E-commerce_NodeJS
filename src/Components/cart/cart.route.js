import { Router } from 'express';
import { addToCart, getAllCarts } from './cart.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';






const router = Router();


router.route("/").get(getAllCarts).post(Authentication, Authorization(["user"]), addToCart);
// router.route("/:id").delete(Authentication, Authorization(["user"]), deleteFromCart).put(Authentication, Authorization(["user"]), updateQuantity);



export default router;