import mongoose from 'mongoose';







const orderSchema = mongoose.Schema({

    cartItems: [

        {
            product: {

                type: mongoose.SchemaTypes.ObjectId,
                ref: "product",

            },

            quantity: {

                type: Number,

            },

            price: {

                type: Number,

            }
        },

    ],


    user: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",

    },


    deliveryAddress: {

        name: {

            type: String,

        },

        address: {

            type: String,

        },

        phone: {

            type: String,

        },

        addressLabel: {

            type: String,
            enum: ["Home", "Work"],
            default: "Home",

        },

    },


    taxShipping: {

        type: Number,

    },

    priceShipping: {

        type: Number,

    },

    discount: {

        type: Number,
        default: 0,

    },


    finalTotalPrice: {

        type: Number,

    },


    payment: {

        type: String,
        enum: ["cash", "visa"],
        default: "cash",

    },

    isPayed: {

        type: Boolean,
        default: false,

    },

    payedAt: {

        type: Date,

    },


    isDelivered: {

        type: Boolean,
        default: false,

    },


    deliveredAt: {

        type: Date,

    },


}, { timestamps: true });



const orderModel = mongoose.model("order", orderSchema);


export default orderModel;