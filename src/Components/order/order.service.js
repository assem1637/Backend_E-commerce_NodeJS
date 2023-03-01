import orderModel from "./order.model.js";
import userModel from '../user/user.model.js';
import productModel from '../product/product.model.js';
import cartModel from '../cart/cart.model.js';
import AppError from "../../Utils/appErrors.js";








// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};







// Get All Orders

export const getAllOrders = ErrorHandler(async (req, res, next) => {

    const allOrders = await orderModel.find({});
    res.status(200).json({ message: "Success", data: allOrders });

});







// Create New Order

export const createOrder = ErrorHandler(async (req, res, next) => {



});






// Payment With Cash On Delivery

export const paymentWithCash = ErrorHandler(async (req, res, next) => {



});