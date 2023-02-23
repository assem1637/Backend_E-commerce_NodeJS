import { Router } from 'express';
import { getAllSubCategories, createSubCategory, getSpecificSubCategory, updateSpecificSubCategory, deleteSpecificSubCategory } from './subCategory.service.js';




const router = Router({ mergeParams: true });



router.route("/").get(getAllSubCategories).post(createSubCategory);
router.route("/:id").get(getSpecificSubCategory).put(updateSpecificSubCategory).delete(deleteSpecificSubCategory);



export default router;