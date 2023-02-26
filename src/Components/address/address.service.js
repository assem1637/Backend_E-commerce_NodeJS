import userModel from "../user/user.model.js";
import AppError from "../../Utils/appErrors.js";









// Function To Handler Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// Get All Address Of Spcific User

export const getUserAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.body.myUser.id });

    if (user) {

        res.status(200).json({ message: "Success", data: user.deliveryAddress });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});







// Create New Address

export const addAddress = ErrorHandler(async (req, res, next) => {

    const { name, address, phone, addressLabel } = req.body;

    const user = await userModel.findOneAndUpdate({ _id: req.body.myUser.id }, {

        $addToSet: { deliveryAddress: { name, address, phone, addressLabel } }

    }, { new: true });

    if (user) {

        res.status(200).json({ message: "Success", data: user.deliveryAddress });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});








// Update Specific Address

export const updateAddress = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;

    const user = await userModel.findOne({ _id: req.body.myUser.id });

    if (user) {


        let specificAddress = user.deliveryAddress.find((ele) => ele._id == id);


        if (specificAddress) {



            if (req.body.name) {

                specificAddress.name = req.body.name;

            };

            if (req.body.address) {

                specificAddress.address = req.body.address;

            };


            if (req.body.phone) {

                specificAddress.phone = req.body.phone;

            };


            if (req.body.addressLabel) {

                specificAddress.addressLabel = req.body.addressLabel;

            };

            await user.save();

            res.status(200).json({ message: "Success Updated", data: user.deliveryAddress });


        } else {

            res.status(400).json({ message: "This Address Not Found" });

        };


    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});








// Delete Specific Address

export const deleteAddress = ErrorHandler(async (req, res, next) => {

    const { id } = req.params;

    const user = await userModel.findOne({ _id: req.body.myUser.id });

    if (user) {


        let specificAddress = user.deliveryAddress.find((ele) => ele._id == id);


        if (specificAddress) {

            user.deliveryAddress.remove(specificAddress);
            await user.save();

            res.status(200).json({ message: "Deleted", data: user.deliveryAddress });

        } else {

            res.status(400).json({ message: "This Address Not Found" });

        };


    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});