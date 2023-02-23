import subCategoryModel from "./subCategory.model.js";
import AppError from '../../Utils/appErrors.js';
import slugify from "slugify";





// Function To Handle Error

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// Get All SubCategories

export const getAllSubCategories = ErrorHandler(async (req, res, next) => {


    if (req.params.categoryId) {

        const All_SubCategories_Of_Category = await subCategoryModel.find({ category: req.params.categoryId }).populate("category", "name");
        res.status(200).json({ message: "Success", data: All_SubCategories_Of_Category });

    } else {

        const allSubCategories = await subCategoryModel.find({}).populate("category", "name");
        res.status(200).json({ message: "Success", data: allSubCategories });

    };

});







// Create New SubCategory

export const createSubCategory = ErrorHandler(async (req, res, next) => {

    req.body.slug = slugify(req.body.name);

    const subCategory = new subCategoryModel(req.body);
    await subCategory.save();

    res.status(200).json({ message: "Success", data: subCategory });

});






// Get Specific SubCategory

export const getSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const subCategory = await subCategoryModel.findOne({ _id: id });

    if (subCategory) {

        res.status(200).json({ message: "Success", data: subCategory });

    } else {

        res.status(400).json({ message: "subCategory Not Found" });

    };

});






// Update Specific SubCategory

export const updateSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;

    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    const subCategory = await subCategoryModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (subCategory) {

        res.status(200).json({ message: "Success Updated", data: subCategory });

    } else {

        res.status(400).json({ message: "subCategory Not Found" });

    };

});








// Delete Specific SubCategory

export const deleteSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const subCategory = await subCategoryModel.findOneAndDelete({ _id: id });

    if (subCategory) {

        res.status(200).json({ message: "Deleted", data: subCategory });

    } else {

        res.status(400).json({ message: "subCategory Not Found" });

    };

});