import { Router } from 'express';
import { getAllSubCategories, createSubCategory, getSpecificSubCategory, updateSpecificSubCategory, deleteSpecificSubCategory } from './subCategory.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';



const router = Router({ mergeParams: true });



router.route("/").get(getAllSubCategories).post(Authentication, Authorization(["admin"]), createSubCategory);
router.route("/:id").get(getSpecificSubCategory).put(Authentication, Authorization(["admin"]), updateSpecificSubCategory).delete(Authentication, Authorization(["admin"]), deleteSpecificSubCategory);



export default router;