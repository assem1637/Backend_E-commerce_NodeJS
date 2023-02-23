import mongoose from "mongoose";







const brandSchema = mongoose.Schema({


    name: {

        type: String,
        required: [true, "Brand Name Is Required"],
        trim: true,
        unique: [true, "Brand Name Is Unique"],
        minlength: [2, "2 Is Too Short Name Of Brand"],

    },


    slug: {

        type: String,
        lowercase: true,

    },


    image: {

        type: String,
        required: [true, "Image Of Brand Is Required"],

    },


}, { timestamps: true });




const brandModel = mongoose.model("brand", brandSchema);


export default brandModel;