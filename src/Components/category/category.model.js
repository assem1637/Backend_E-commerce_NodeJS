import mongoose from "mongoose";






const categorySchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Category Name Is Required"],
        trim: true,
        unique: [true, "Category Name Is Unique"],
        minlength: [2, "2 Is Too Short Name Of Category"],

    },


    slug: {

        type: String,
        lowercase: true,

    },


    image: {

        type: String,
        required: [true, "Image Of Category Is Required"],

    },


}, { timestamps: true });




const categoryModel = mongoose.model("category", categorySchema);




export default categoryModel;