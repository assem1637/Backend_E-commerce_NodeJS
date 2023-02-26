import mongoose from "mongoose";









const reviewSchema = mongoose.Schema({


    comment: {

        type: String,
        required: [true, "Comment Of Review Is Required"],
        trim: true,
        minlength: [2, "2 Is Too Short Comment Of Review"],

    },



    product: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "product",

    },



    user: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",

    },



    ratingAverage: {

        type: Number,
        min: [1, "1 Is The Lowest Rate"],
        max: [5, "5 Is The Largest Rate"],
        required: [true, "ratingAverage Of Product Is Required"],

    },



}, { timestamps: true });




const reviewModel = mongoose.model("review", reviewSchema);



export default reviewModel;