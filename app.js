process.on("uncaughtException", (err) => {

    console.log("UncaughtException", err);

});




import dotenv from 'dotenv'
dotenv.config({ path: "./config/.env" });





import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import rateLimit from 'express-rate-limit'
import morgan from 'morgan';
import AppError from './src/Utils/appErrors.js';
import categoryRouter from './src/Components/category/category.route.js';
import subCategoryRouter from './src/Components/subCategory/subCategory.route.js';
import brandRouter from './src/Components/brand/brand.route.js';
import productRouter from './src/Components/product/product.route.js';
import userRouter from './src/Components/user/user.route.js';
import wishlistRouter from './src/Components/wishlist/wishlist.route.js';
import addressRouter from './src/Components/address/address.route.js';
import reviewRouter from './src/Components/review/review.route.js';
import couponRouter from './src/Components/coupon/coupon.route.js';
import cartRouter from './src/Components/cart/cart.route.js';
import orderRouter from './src/Components/order/order.route.js';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';



const app = express();
const port = process.env.PORT || 3000;


dbConnection();


app.use(express.json({ limit: "20kb" }));



if (process.env.MODE_NOW === "Development") {

    app.use(morgan("dev"));

};


// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss());


// middleware to protect against HTTP Parameter Pollution attacks

app.use(hpp({
    whitelist: [

        "price",
        "soldCount",
        "quantity",
        "ratingCount",
        "ratingAverage",

    ]
}));


const createAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 create account requests per `window` (here, per 15 minutes)
    message:
        'Too many accounts created from this IP, please try again after after 15 minutes',
});

// Apply the rate limiting middleware to all requests
app.use("/api", createAccountLimiter);



app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);




app.all("*", (req, res, next) => {

    return next(new AppError(`This Is Route: ${req.originalUrl} Not Found In The Server`, 404));

});




app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 404;

    if (process.env.MODE_NOW === "Development") {

        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode, err, stack: err.stack });

    } else {

        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode, err });

    };

});




app.listen(port, () => {

    console.log('Server Is Running...');

});


// Handle rejection outside express

process.on("unhandledRejection", (err) => {

    console.log("UnhandledRejection", err);

});