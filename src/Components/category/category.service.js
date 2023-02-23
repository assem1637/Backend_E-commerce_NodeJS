import categoryModel from "./category.model.js";
import cloudinary from 'cloudinary';
import AppError from '../../Utils/appErrors.js';
import slugify from "slugify";





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






// Get All Categories

export const getAllCategories = ErrorHandler(async (req, res, next) => {

    const allCategories = await categoryModel.find({});
    res.status(200).json({ message: "Success", data: allCategories });

});






// Create New Category

export const createCategory = ErrorHandler(async (req, res, next) => {


    req.body.slug = slugify(req.body.name);

    // Upload
    const cloud = await cloudinary.uploader.upload(req.file.path);
    req.body.image = cloud.secure_url;


    const category = new categoryModel(req.body);
    await category.save();

    res.status(200).json({ message: "Success", data: category });

});







// Get Specific Category

export const getSpecificCategory = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const category = await categoryModel.findOne({ _id: id });

    if (category) {

        res.status(200).json({ message: "Success", data: category });

    } else {

        res.status(200).json({ message: "Category Not Found" });

    };

});







// Update Specific Category

export const updateSpeicifcCategory = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;

    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    if (req.file) {

        // Upload
        const cloud = await cloudinary.uploader.upload(req.file.path);
        req.body.image = cloud.secure_url;

    };


    const category = await categoryModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (category) {

        res.status(200).json({ message: "Success Updated", data: category });

    } else {

        res.status(400).json({ message: "Category Not Found" });

    };

});








// Delete Specific Category

export const deleteSpecificCategory = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const category = await categoryModel.findOneAndDelete({ _id: id });

    if (category) {

        res.status(200).json({ message: "Deleted", data: category });

    } else {

        res.status(400).json({ message: "Category Not Found" });

    };

});