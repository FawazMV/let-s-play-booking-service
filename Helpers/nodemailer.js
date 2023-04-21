import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.OAuthEmail,
        pass: process.env.OAuthPassword
    }
});

const sendMail = (to, subject, text) => {
    const mailOptions = {
        from: 'let-s-play@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

export default sendMail;
