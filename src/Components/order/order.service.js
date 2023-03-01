import orderModel from "./order.model.js";
import userModel from '../user/user.model.js';
import productModel from '../product/product.model.js';
import cartModel from '../cart/cart.model.js';
import AppError from "../../Utils/appErrors.js";
import stripe from "stripe";
import jwt from 'jsonwebtoken';





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






// Get All Order For Specific User

export const ordersOfUser = ErrorHandler(async (req, res, next) => {

    const orders = await orderModel.find({ user: req.body.myUser.id });

    if (orders) {

        res.status(200).json({ message: "Success", data: orders });

    } else {

        res.status(400).json({ message: "Not Found Any Order" });

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





// Update Delivery With Admin

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









// Create Checkout Session

const Stripe = stripe("sk_test_51MePkhFMgxntNfLr6tkdfgDXl3uIHUV4W9OZepEWs9m5WvbRG3rkZLvDDyKRLlZs0z1wyii3wk12iqG5bosMO7Ju00wkU6GSvj");

export const checkoutSession = ErrorHandler(async (req, res, next) => {

    const cart = await cartModel.findOne({ user: req.body.myUser.id });
    const user = await userModel.findOne({ _id: req.body.myUser.id });

    const token = jwt.sign({ payWithVisa: true }, process.env.SECRET_KEY_PAY_WITH_VISA);

    const session = await Stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell

                price_data: {

                    currency: "USD",

                    product_data: {

                        name: user.name,

                    },

                    unit_amount: cart.totlaPriceAfterDiscount * 100,

                },

                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.headers.host}/api/v1/order/paymentWithStripe/${token}`,
        cancel_url: `${req.protocol}://${req.headers.host}/cart`,
    });


    res.status(200).json({ message: "Success", data: session.url });

});







// Payment With Stripe

export const paymentWithStripe = ErrorHandler(async (req, res, next) => {

    const cart = await cartModel.findOne({ user: req.body.myUser.id });
    const user = await userModel.findOne({ _id: req.body.myUser.id });


    jwt.verify(req.params.token, process.env.SECRET_KEY_PAY_WITH_VISA, async function (err, decoded) {

        if (err) {

            res.status(400).json({ message: "Invalid Payed", err });

        } else {


            if (decoded.payWithVisa) {


                if (cart) {


                    req.body.cartItems = cart.cartItems;
                    req.body.user = user._id;
                    req.body.deliveryAddress = user.deliveryAddress[user.deliveryAddress.length - 1];
                    req.body.taxShipping = 0;
                    req.body.priceShipping = 0;
                    req.body.discount = cart.discount;
                    req.body.payment = "visa";
                    req.body.isPayed = true;
                    req.body.payedAt = Date.now();
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



            };

        };

    });

});


