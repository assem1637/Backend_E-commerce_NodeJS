import Joi from 'joi';





const validSchema = Joi.object({

    name: Joi.string().min(2).max(30).required(),
    age: Joi.number().min(5).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).max(50).required(),
    repassword: Joi.ref("password"),

});





const validation = (req, res, next) => {

    const { error } = validSchema.validate(req.body, { abortEarly: false });
    const listErrors = [];

    if (error) {

        error.details.map((err) => {

            listErrors.push(err.message);

        });

        res.status(400).json({ error: listErrors });

    } else {

        next();

    };

};



export default validation;