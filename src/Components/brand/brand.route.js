import { Router } from 'express';
import { getAllBrands, createBrand, getSpecificBrand, updateSpecificBrand, deleteSpecificBrand } from './brand.service.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';






const router = Router();


router.route("/").get(getAllBrands).post(uploadSingleImage("image"), createBrand);
router.route("/:id").get(getSpecificBrand).put(uploadSingleImage("image"), updateSpecificBrand).delete(deleteSpecificBrand);



export default router;