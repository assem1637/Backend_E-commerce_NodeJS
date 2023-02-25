import { Router } from 'express';
import { getAllProducts, createProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from '../../Utils/uploadImage.js';
import { Authentication, Authorization } from '../user/user.auth.js';



const paths = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 3 }];



const router = Router();


router.route("/").get(getAllProducts).post(Authentication, Authorization(["admin"]), uploadFieldsImage(paths), createProduct);
router.route("/:id").get(getSpecificProduct).put(Authentication, Authorization(["admin"]), uploadFieldsImage(paths), updateSpecificProduct).delete(Authentication, Authorization(["admin"]), deleteSpecificProduct);




export default router;