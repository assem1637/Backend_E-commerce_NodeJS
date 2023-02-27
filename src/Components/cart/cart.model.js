import mongoose from 'mongoose';







const cartSchema = mongoose.Schema({

    cartItems: [

        {

            product: { type: mongoose.SchemaTypes.ObjectId, ref: "product" },
            quantity: { type: Number, default: 1 },
            price: { type: Number, },

        },

    ],


    user: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",

    },


    totalPrice: {

        type: Number,

    },


    discount: {

        type: Number,
        default: 0,

    },


    totlaPriceAfterDiscount: {

        type: Number,

    },


}, { timestamps: true });




const cartModel = mongoose.model("cart", cartSchema);



export default cartModel;