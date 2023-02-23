import mongoose from 'mongoose';




const productSchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Product Name Is Required"],
        trim: true,
        unique: [true, "Product Name Is Unique"],
        minlength: [2, "2 Is Too Short Name Of Product"],

    },


    slug: {

        type: String,
        lowercase: true,

    },


    price: {

        type: Number,
        required: [true, "Product Price Is Required"],

    },

    priceAfterDiscount: {

        type: Number,
        required: [true, "Product priceAfterDiscount Is Required"],

    },

    imageCover: {

        type: String,
        required: [true, "ImageCover Of Product Is Required"],

    },


    images: [String],

    colors: [String],

    category: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        required: [true, "Category Of Product Is Required"],

    },


    subcategory: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "subcategory",
        required: [true, "subCategory Of Product Is Required"],

    },


    brand: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "brand",
        required: [true, "Brand Of Product Is Required"],

    },


    description: {

        type: String,
        required: [true, "Description Of Product Is Required"],

    },


    quantity: {

        type: Number,
        required: [true, "Quantity Of Product Is Required"],

    },


    soldCount: {

        type: Number,
        default: 0,

    },


    ratingCount: {

        type: Number,
        default: 0,

    },


    ratingAverage: {

        type: Number,
        min: [1, "1 Is The Lowest Rate"],
        max: [5, "5 Is The Largest Rate"],
        required: [true, "ratingAverage Of Product Is Required"],

    },


}, { timestamps: true });



const productModel = mongoose.model("product", productSchema);



export default productModel;