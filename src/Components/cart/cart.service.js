import cartModel from "./cart.model.js";
import productModel from '../product/product.model.js';
import AppError from '../../Utils/appErrors.js';







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};




// Get All Carts

export const getAllCarts = ErrorHandler(async (req, res, next) => {

    const allCarts = await cartModel.find({}).populate("user cartItems.product", "name");
    res.status(200).json({ message: "Success", data: allCarts });

});




// Function To Calc Total Price 

const calcTotalPrice = (cartItems) => {


    let totalPrice = 0;

    cartItems.forEach((ele) => {

        totalPrice += Number(ele.price) * Number(ele.quantity);

    });

    return totalPrice;

};




// Add Product To My Cart

export const addToCart = ErrorHandler(async (req, res, next) => {


    const cart = await cartModel.findOne({ user: req.body.myUser.id });

    if (cart) {

        const product = await productModel.findOne({ _id: req.body.product });

        const ProductInCartItems = cart.cartItems.find((ele) => ele.product == product.id);

        if (ProductInCartItems) {

            ProductInCartItems.quantity += req.body.quantity;

            cart.totalPrice = calcTotalPrice(cart.cartItems);
            cart.discount = 0;
            cart.totlaPriceAfterDiscount = Number(cart.totalPrice) - Number(cart.discount);

            await cart.save();

            res.status(200).json({ message: "Success Add To Cart", data: cart });


        } else {

            cart.cartItems.push({

                product: req.body.product,
                quantity: req.body.quantity,
                price: product.price,

            });

            cart.totalPrice = calcTotalPrice(cart.cartItems);
            cart.discount = 0;
            cart.totlaPriceAfterDiscount = Number(cart.totalPrice) - Number(cart.discount);

            await cart.save();

            res.status(200).json({ message: "Success Add To Cart", data: cart });

        };

    } else {


        const product = await productModel.findOne({ _id: req.body.product });

        req.body.user = req.body.myUser.id;

        req.body.cartItems = [{

            product: req.body.product,
            quantity: req.body.quantity,
            price: product.price,

        }];

        req.body.totalPrice = Number(product.price * req.body.quantity);
        req.body.discount = 0;
        req.body.totlaPriceAfterDiscount = Number(req.body.totalPrice) - Number(req.body.discount);

        const newCart = new cartModel(req.body);
        await newCart.save();

        res.status(200).json({ message: "Success Create Your Cart And Add Product To Cart", data: newCart });

    };

});