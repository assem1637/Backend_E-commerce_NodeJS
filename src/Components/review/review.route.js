import { Router } from 'express';
import { getUserReviews, addReview, updateReview, deleteReview } from './review.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';





const router = Router();



router.route("/").get(Authentication, Authorization(["user"]), getUserReviews).post(Authentication, Authorization(["user"]), addReview);
router.route("/:id").put(Authentication, Authorization(["user"]), updateReview).delete(Authentication, Authorization(["admin", "user"]), deleteReview);





export default router;