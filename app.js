process.on("uncaughtException", (err) => {

    console.log("UncaughtException", err);

});



import dotenv from 'dotenv'
dotenv.config({ path: "./config/.env" });




import express from 'express';
import dbConnection from './src/DB/dbConnection.js';
import morgan from 'morgan';
import AppError from './src/Utils/appErrors.js';
import categoryRouter from './src/Components/category/category.route.js';
import subCategoryRouter from './src/Components/subCategory/subCategory.route.js';
import brandRouter from './src/Components/brand/brand.route.js';
import productRouter from './src/Components/product/product.route.js';




const app = express();
const port = process.env.PORT || 3000;


dbConnection();


app.use(express.json());



if (process.env.MODE_NOW === "Development") {

    app.use(morgan("dev"));

};




app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/products", productRouter);




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



process.on("unhandledRejection", (err) => {

    console.log("UnhandledRejection", err);

});