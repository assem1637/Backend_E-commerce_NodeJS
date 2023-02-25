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






// SignUp

export const signup = ErrorHandler(async (req, res, next) => {

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






// SignIn

export const signin = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (user) {

        const match = await bcrypt.compare(password, user.password);

        if (match) {


            if (user.emailConfirm) {

                const token = jwt.sign({ id: user._id, name: user.name, age: user.age, email: user.email, phone: user.phone, emailConfirm: user.emailConfirm, isActive: user.isActive, role: user.role, profileImg: user.profileImg }, process.env.SECRET_KEY_SIGNIN);
                res.status(200).json({ message: "Success", token });

            } else {

                res.status(400).json({ message: "Please, Confirm Your Email Then Try Again" });

            };


        } else {

            res.status(400).json({ message: "Password Incorrect" });

        };


    } else {

        res.status(400).json({ message: "Email Doesn't Exists" });

    };

});








// Confirm Your Email

export const confirmation = ErrorHandler(async (req, res, next) => {

    const { token } = req.params;

    jwt.verify(token, process.env.SECRET_KEY_SIGNUP, async function (err, decoded) {


        if (err) {

            res.status(400).json({ message: "Invalid Token", err });

        } else {

            const user = await userModel.findOne({ email: decoded.email });


            if (user) {

                await userModel.findOneAndUpdate({ _id: user._id }, { emailConfirm: true });
                res.status(200).json({ message: "Your Email Confirmed" });

            } else {

                res.status(400).json({ message: "User Not Found" });

            };

        };

    });

});