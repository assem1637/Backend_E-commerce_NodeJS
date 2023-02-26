import productModel from "./product.model.js";
import AppError from '../../Utils/appErrors.js';
import slugify from "slugify";
import cloudinary from 'cloudinary';
import ApiFeatures from "../../Utils/apiFeatures.js";






// Configuration 
cloudinary.config({
    cloud_name: "djlovbcqr",
    api_key: "568977767877133",
    api_secret: "VmynEmh10iyaIqCEg3Ee9X-P4F8"
});






// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};







// Get All Products

export const getAllProducts = ErrorHandler(async (req, res, next) => {

    // MongooseQuery

    let MongooseQuery = productModel.find({}).populate("category subcategory brand", "name").populate("reviews", "comment ratingAverage");

    let apiFeatures = new ApiFeatures(MongooseQuery, req.query).search().pagination().fields().sort().filter();


    const allProducts = await apiFeatures.MongooseQuery;

    res.status(200).json({ message: "Success", page: apiFeatures.page, data: allProducts });

});





// Create New Product

export const createProduct = ErrorHandler(async (req, res, next) => {

    req.body.slug = slugify(req.body.name);


    if (req.files.imageCover) {

        const cloud = await cloudinary.uploader.upload(req.files.imageCover[0].path);
        req.body.imageCover = cloud.secure_url;

    };


    if (req.files.images) {

        let imgPaths = [];
        let finalImgs = [];

        (req.files.images).forEach((ele) => {

            imgPaths.push(ele.path);

        });


        for (let x = 0; x < imgPaths.length; x++) {

            const cloud = await cloudinary.uploader.upload(imgPaths[x]);
            finalImgs.push(cloud.secure_url);

        };


        req.body.images = finalImgs;

    };



    const product = new productModel(req.body);
    await product.save();


    res.status(200).json({ message: "Success", data: product });

});






// Get Specific Product

export const getSpecificProduct = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const product = await productModel.findOne({ _id: id });

    if (product) {

        res.status(200).json({ message: "Success", data: product });

    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});





// Update Specific Product

export const updateSpecificProduct = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;



    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };




    if (req.files.imageCover) {

        const cloud = await cloudinary.uploader.upload(req.files.imageCover[0].path);
        req.body.imageCover = cloud.secure_url;

    };




    if (req.files.images) {

        let imgPaths = [];
        let finalImgs = [];

        (req.files.images).forEach((ele) => {

            imgPaths.push(ele.path);

        });


        for (let x = 0; x < imgPaths.length; x++) {

            const cloud = await cloudinary.uploader.upload(imgPaths[x]);
            finalImgs.push(cloud.secure_url);

        };


        req.body.images = finalImgs;

    };


    const product = await productModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (product) {

        res.status(200).json({ message: "Success Updated", data: product });

    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});






// Delete Specific Product

export const deleteSpecificProduct = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const product = await productModel.findOneAndDelete({ _id: id });

    if (product) {

        res.status(200).json({ message: "Deleted", data: product });

    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});

