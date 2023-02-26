import reviewModel from "./review.model.js";
import AppError from '../../Utils/appErrors.js';
import productModel from "../product/product.model.js";
import userModel from "../user/user.model.js";








// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};









// Get All Reviews Of Specific User

export const getUserReviews = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.body.myUser.id });

    if (user) {

        const ReviewsOfUser = await reviewModel.find({ user: req.body.myUser.id }).populate("product user", "name");

        res.status(200).json({ message: "Success", data: ReviewsOfUser });


    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});






// Add New Review

export const addReview = ErrorHandler(async (req, res, next) => {

    const review = await reviewModel.findOne({ product: req.body.product, user: req.body.myUser.id });

    if (review) {

        res.status(400).json({ message: "You Already Reviewed" });

    } else {

        req.body.user = req.body.myUser.id;
        const newReview = new reviewModel(req.body);
        await newReview.save();
        await productModel.findOneAndUpdate({ _id: req.body.product }, { $inc: { ratingCount: 1 } });

        res.status(200).json({ message: "Success", data: newReview });

    };

});






// Update Specific Review

export const updateReview = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const review = await reviewModel.findOneAndUpdate({ _id: id }, req.body, { new: true });

    if (review) {

        res.status(200).json({ message: "Success Updated", data: review });

    } else {

        res.status(400).json({ message: "This Is Review Not Found" });

    };

});





// Delete Specific Review

export const deleteReview = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const review = await reviewModel.findOneAndDelete({ _id: id });

    if (review) {

        await productModel.findOneAndUpdate({ _id: review.product }, { $inc: { ratingCount: -1 } });
        res.status(200).json({ message: "Deleted", data: review });

    } else {

        res.status(400).json({ message: "This Is Review Not Found" });

    };

}); 