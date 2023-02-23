import { Router } from 'express';
import { getAllCategories, createCategory, getSpecificCategory, updateSpeicifcCategory, deleteSpecificCategory } from './category.service.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';
import subCategoryRouter from '../subCategory/subCategory.route.js';


const router = Router();



router.use("/:categoryId/subcategory", subCategoryRouter);


router.route("/").get(getAllCategories).post(uploadSingleImage("image"), createCategory);
router.route("/:id").get(getSpecificCategory).put(uploadSingleImage("image"), updateSpeicifcCategory).delete(deleteSpecificCategory);



export default router;