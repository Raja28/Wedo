const nodemailer = require("nodemailer")
require("dotenv").config()

exports.otpMailSender = async (email, title, otp) => {

    try {

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `WeDo || Raja 👻 <no-reply@wedo.com>`, // sender address
            to: email, // list of receivers
            subject: "WeDo verification mail", // Subject line
            text: "Verification Mail", // plain text body
            html: `WeDo verification OTP: ${otp} valid for 5 minutes.`, // html body
        });
        return info

    } catch (error) {

    }

}