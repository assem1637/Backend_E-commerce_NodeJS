import nodemailer from 'nodemailer';






const confirmEmail = async (email, token, protocol, host) => {

    // create reusable transporter object using the default SMTP transport

    let transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
        },
    });



    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"E-Shop 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Confirm Email ✔", // Subject line
        text: "Confirm Email", // plain text body
        html: `
        

            <a href="${protocol}://${host}/api/v1/user/confirm/${token}" target="_blank">Click Here To Confirm Your Email</a>

        
        `, // html body
    });

};



export default confirmEmail;