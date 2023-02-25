import userModel from './user.model.js';
import AppError from '../../Utils/appErrors.js';
import cloudinary from 'cloudinary';
import confirmEmail from '../../Utils/sendConfirmEmail.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';





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







// Get All Users

export const getAllUsers = ErrorHandler(async (req, res, next) => {

    const allUsers = await userModel.find({});
    res.status(200).json({ message: "Success", data: allUsers });

});







// Create New User

export const createUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (user) {

        res.status(400).json({ message: "Email Already Exists" });

    } else {

        bcrypt.hash(req.body.password, 5, async function (err, hash) {

            req.body.password = hash;


            if (req.file) {

                const cloud = await cloudinary.uploader.upload(req.file.path);
                req.body.profileImg = cloud.secure_url;

            };

            const user = new userModel(req.body);
            await user.save();


            const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
            confirmEmail(req.body.email, token, req.protocol, req.headers.host);

            res.status(200).json({ message: "Success", data: user });

        });


    };

});








// Get Specific User

export const getSpecificUser = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const user = await userModel.findOne({ _id: id });

    if (user) {

        res.status(200).json({ message: "Success", data: user });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});






// Update Specific User

export const updateSpecificUser = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;


    if (req.file) {

        const cloud = await cloudinary.uploader.upload(req.file.path);
        req.body.profileImg = cloud.secure_url;

    };


    if (req.body.email) {

        const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
        confirmEmail(req.body.email, token, req.protocol, req.headers.host);

    };


    if (req.body.password) {


        bcrypt.hash(req.body.password, 5, async function (err, hash) {

            req.body.password = hash;

            const user = await userModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });

            if (user) {

                res.status(200).json({ message: "Success Updated", data: user });

            } else {

                res.status(200).json({ message: "User Not Found" });

            };

        });

    } else {

        const user = await userModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });

        if (user) {

            res.status(200).json({ message: "Success Updated", data: user });

        } else {

            res.status(200).json({ message: "User Not Found" });

        };

    };

});





// Delete Specific User

export const deleteSpecificUser = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const user = await userModel.findOneAndDelete({ _id: id });

    if (user) {

        res.status(200).json({ message: "Deleted", data: user });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});