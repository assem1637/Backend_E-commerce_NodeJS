import { Router } from 'express';
import { getUserWishlist, addToWishlist, deleteFromWishlist } from './wishlist.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();


router.route("/").get(Authentication, Authorization(["user"]), getUserWishlist);
router.route("/:id").post(Authentication, Authorization(["user"]), addToWishlist).delete(Authentication, Authorization(["user"]), deleteFromWishlist);



export default router;