import { Router } from 'express';
import { getAllProducts, createProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from '../../Utils/uploadImage.js';



const paths = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 3 }];



const router = Router();


router.route("/").get(getAllProducts).post(uploadFieldsImage(paths), createProduct);
router.route("/:id").get(getSpecificProduct).put(uploadFieldsImage(paths), updateSpecificProduct).delete(deleteSpecificProduct);




export default router;