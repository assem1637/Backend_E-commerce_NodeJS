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

    const allOrders = await orderModel.find({}).populate("cartItems.product user", "name");
    res.status(200).json({ message: "Success", data: allOrders });

});







// Payment With Cash On Delivery

export const paymentWithCash = ErrorHandler(async (req, res, next) => {

    const cart = await cartModel.findOne({ user: req.body.myUser.id });
    const user = await userModel.findOne({ _id: req.body.myUser.id });


    if (cart) {


        req.body.cartItems = cart.cartItems;
        req.body.user = user._id;
        req.body.deliveryAddress = user.deliveryAddress[user.deliveryAddress.length - 1];
        req.body.taxShipping = 0;
        req.body.priceShipping = 0;
        req.body.discount = cart.discount;
        req.body.finalTotalPrice = Number(cart.totlaPriceAfterDiscount) - (Number(req.body.taxShipping) + Number(req.body.priceShipping));

        const newOrder = new orderModel(req.body);
        await newOrder.save();



        cart.cartItems.forEach(async (ele) => {

            const product = await productModel.findOne({ _id: ele.product });
            product.soldCount += 1;
            product.quantity -= ele.quantity;
            await product.save();

        });



        await cartModel.findOneAndDelete({ user: cart.user });


        res.status(200).json({ message: "Success Order", data: newOrder });

    } else {

        res.status(400).json({ message: "Your Cart Is Not Found" });

    };

});






// Update Pay With Admin

export const updatePay = ErrorHandler(async (req, res, next) => {

    const order = await orderModel.findOne({ _id: req.params.id });

    if (order) {

        order.isPayed = true;
        order.payedAt = Date.now();
        await order.save();

        res.status(200).json({ message: "Success Updated The Pay", data: order });

    } else {

        res.status(400).json({ message: "Order Not Found" });

    };

});





// Update Pay With Admin

export const updateDelivery = ErrorHandler(async (req, res, next) => {

    const order = await orderModel.findOne({ _id: req.params.id });

    if (order) {

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();

        res.status(200).json({ message: "Success Updated The Delivery order", data: order });

    } else {

        res.status(400).json({ message: "Order Not Found" });

    };

});



