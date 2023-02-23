import mongoose from "mongoose";







const subCategorySchema = mongoose.Schema({


    name: {

        type: String,
        required: [true, "Name Of SubCategory Is Required"],
        trim: true,
        unique: [true, "Name Of SubCategory Is Unique"],
        minlength: [2, "2 Is Too Short Name Of SubCategory"],

    },


    slug: {

        type: String,
        lowercase: true,

    },


    category: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        required: [true, "Category Of SubCategory Is Required"],

    },



}, { timestamps: true });



const subCategoryModel = mongoose.model("subcategory", subCategorySchema);



export default subCategoryModel;