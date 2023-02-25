import mongoose from "mongoose";







const userSchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of User Is Required"],
        trim: true,
        minlength: [2, "2 Is Too Short Name Of User"],

    },


    age: {

        type: Number,
        min: [5, "5 Is The Lowest Age"],
        max: [100, "100 Is The Largest Age"],
        required: [true, "Age Of User Is Required"],

    },


    email: {

        type: String,
        required: [true, "Email Of User Is Required"],

    },


    password: {

        type: String,
        minlength: [6, "6 Is Too Short Password Of User"],
        required: [true, "Password Of User Is Required"],

    },


    emailConfirm: {

        type: Boolean,
        default: false,

    },


    isActive: {

        type: Boolean,
        default: true,

    },


    phone: {

        type: String,
        required: [true, "Phone Of User Is Required"],

    },


    role: {

        type: String,
        enum: ["user", "admin"],
        default: "user",

    },


    profileImg: {

        type: String,

    },


    passwordChangedAt: Date,


}, { timestamps: true });





const userModel = mongoose.model("user", userSchema);


export default userModel;