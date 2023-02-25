import { Router } from 'express';
import { getAllCategories, createCategory, getSpecificCategory, updateSpeicifcCategory, deleteSpecificCategory } from './category.service.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';
import subCategoryRouter from '../subCategory/subCategory.route.js';
import { Authentication, Authorization } from '../user/user.auth.js';


const router = Router();



router.use("/:categoryId/subcategory", subCategoryRouter);


router.route("/").get(getAllCategories).post(Authentication, Authorization(["admin"]), uploadSingleImage("image"), createCategory);
router.route("/:id").get(getSpecificCategory).put(Authentication, Authorization(["admin"]), uploadSingleImage("image"), updateSpeicifcCategory).delete(Authentication, Authorization(["admin"]), deleteSpecificCategory);



export default router;