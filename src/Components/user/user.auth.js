import userModel from './user.model.js';
import AppError from '../../Utils/appErrors.js';
import cloudinary from 'cloudinary';
import confirmEmail from '../../Utils/sendConfirmEmail.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sendResetCode from '../../Utils/sendResetCode.js';




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

        const match = await bcrypt.compare(req.body.password, user.password);

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









// Authentication


export const Authentication = ErrorHandler(async (req, res, next) => {

    const token = req.header("token");

    jwt.verify(token, process.env.SECRET_KEY_SIGNIN, async function (err, decoded) {


        if (err) {

            res.status(400).json({ message: "Invalid Token", err });

        } else {


            const user = await userModel.findOne({ _id: decoded.id });


            if (user) {


                if (user.passwordChangedAt) {


                    if (user.passwordChangedAt > decoded.iat) {

                        res.status(400).json({ message: "Your Password Changed" });

                    } else {

                        req.body.myUser = user;
                        next();

                    };


                } else {

                    req.body.myUser = user;
                    next();

                };

            } else {

                res.status(400).json({ message: "User Not Found" });

            };

        };

    });

});








// Authorization


export const Authorization = (roles) => {

    return (req, res, next) => {

        if (roles.includes(req.body.myUser.role)) {

            next();

        } else {

            res.status(400).json({ message: "You Not Authorized For Do That" });

        };

    };

};






// Forget Password

export const forgetPassword = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });

    if (user) {

        let resetCode = Math.floor((Math.random() * 1000000) + 1).toString();

        bcrypt.hash(resetCode, 5, async function (err, hash) {

            user.resetCode = hash;
            await user.save();
            sendResetCode(user.email, user.name, resetCode);
            res.status(200).json({ message: "Success Send Reset Code" });

        });

    } else {

        res.status(400).json({ message: `We couldn't find an account associated with ${req.body.email}. Please try with an alternate email.` });

    };

});






// Verify Reset Code

export const verifyResetCode = ErrorHandler(async (req, res, next) => {

    const userId = req.header("userId");
    const user = await userModel.findOne({ _id: userId });

    if (user) {

        const match = await bcrypt.compare(req.body.resetCode, user.resetCode);

        if (match) {

            res.status(200).json({ message: "Success Confirm Reset Code" });

        } else {

            res.status(400).json({ message: "That's not the right code" });

        };


    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});






// Change Password After Confirm Reset Code

export const changePasswordAfterConfirmResetCode = ErrorHandler(async (req, res, next) => {

    const userId = req.header("userId");
    const user = await userModel.findOne({ _id: userId });

    if (user) {

        bcrypt.hash(req.body.password, 5, async function (err, hash) {

            user.password = hash;
            user.passwordChangedAt = parseInt(Date.now() / 1000);
            await user.save();
            res.status(200).json({ message: "Success Change Password" });

        });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});