import brandModel from "./brand.model.js";
import AppError from "../../Utils/appErrors.js";
import slugify from "slugify";
import cloudinary from 'cloudinary';








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







// Get All Brands

export const getAllBrands = ErrorHandler(async (req, res, next) => {

    const allBrands = await brandModel.find({});
    res.status(200).json({ message: "Success", data: allBrands });

});





// Create New Brand

export const createBrand = ErrorHandler(async (req, res, next) => {

    req.body.slug = slugify(req.body.name);


    // Upload
    const cloud = await cloudinary.uploader.upload(req.file.path);
    req.body.image = cloud.secure_url;


    const brand = new brandModel(req.body);
    await brand.save();


    res.status(200).json({ message: "Success", data: brand });

});







// Get Specific Brand

export const getSpecificBrand = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const brand = await brandModel.findOne({ _id: id });


    if (brand) {

        res.status(200).json({ message: "Success", data: brand });

    } else {

        res.status(400).json({ message: "Brand Not Found" });

    };

});






// Update Specific Brand

export const updateSpecificBrand = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;


    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    if (req.file) {

        // Upload
        const cloud = await cloudinary.uploader.upload(req.file.path);
        req.body.image = cloud.secure_url;

    };



    const brand = await brandModel.findOneAndUpdate({ _id: id }, req.body, { new: true });


    if (brand) {

        res.status(200).json({ message: "Success Updated", data: brand });

    } else {

        res.status(400).json({ message: "Brand Not Found" });

    };


});






// Delete Specific Brand

export const deleteSpecificBrand = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const brand = await brandModel.findOneAndDelete({ _id: id });


    if (brand) {

        res.status(200).json({ message: "Deleted", data: brand });

    } else {

        res.status(400).json({ message: "Brand Not Found" });

    };


});