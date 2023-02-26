import userModel from "../user/user.model.js";
import AppError from '../../Utils/appErrors.js';







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};





// Get All Wishlist Of Specific User

export const getUserWishlist = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.body.myUser.id });

    if (user) {

        res.status(200).json({ message: "Success", data: user.wishlist });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});




// Add Product To Wishlist

export const addToWishlist = ErrorHandler(async (req, res, next) => {



    const { id } = req.params;
    const user = await userModel.findOneAndUpdate({ _id: req.body.myUser.id }, { $addToSet: { wishlist: id } }, { new: true });

    if (user) {

        res.status(200).json({ message: "Success Add To Wishlist", data: user.wishlist });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});






// Delete Product From Wishlist

export const deleteFromWishlist = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const user = await userModel.findOneAndUpdate({ _id: req.body.myUser.id }, { $pull: { wishlist: id } }, { new: true });

    if (user) {

        res.status(200).json({ message: "Success Delete From Wishlist", data: user.wishlist });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});