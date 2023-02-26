import couponModel from './coupon.model.js';
import AppError from '../../Utils/appErrors.js';










// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// Get All Coupons

export const getAllCoupons = ErrorHandler(async (req, res, next) => {

    const allCoupons = await couponModel.find({});
    res.status(200).json({ message: "Success", data: allCoupons });

});






// Create New Coupon

export const createCoupon = ErrorHandler(async (req, res, next) => {

    req.body.expire = Date.now() + (24 * 60 * 60 * 1000);

    const coupon = new couponModel(req.body);
    await coupon.save();


    res.status(200).json({ message: "Success", data: coupon });

});





// Get Specific Coupon

export const getSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;
    const coupon = await couponModel.findOne({ _id: id });

    if (coupon) {

        res.status(200).json({ message: "Success", data: coupon });

    } else {

        res.status(400).json({ message: "Coupon Not Found" });

    };

});






// Update Specific Coupon

export const updateSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;

    req.body.expire = Date.now() + (24 * 60 * 60 * 1000);

    const coupon = await couponModel.findByIdAndUpdate({ _id: id }, req.body, { new: true });

    if (coupon) {

        res.status(200).json({ message: "Success Updated", data: coupon });

    } else {

        res.status(400).json({ message: "Coupon Not Found" });

    };

});






// Deleted Specific Coupon

export const deleteSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;

    const coupon = await couponModel.findByIdAndDelete({ _id: id });

    if (coupon) {

        res.status(200).json({ message: "Deleted", data: coupon });

    } else {

        res.status(400).json({ message: "Coupon Not Found" });

    };

});