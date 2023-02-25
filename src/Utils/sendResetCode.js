import nodemailer from 'nodemailer';






const sendResetCode = async (email, name, resetCode) => {

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
        from: '"E-Shop 👻" <assemsaeed16378@outlook.com>', // sender address
        to: email, // list of receivers
        subject: `${name}, here's your PIN ✔`, // Subject line
        text: `${name}, here's your PIN`, // plain text body
        html: `
        
            <h2>Hi ${name},</h2>
            <br />
            <p>We received a request to reset the password on your E-Shop Account.</p>
            <br />
            <br />
            <h2>${resetCode}</h2>
            <br />
            <br />
            <p>Enter this code to complete the reset.</p>
            <br />
            <div>
                <p>Thanks for helping us keep your account secure.</p>
                <p>The E-Shop Team</p>
            </div>
            <br />
        
        `, // html body
    });

};



export default sendResetCode;