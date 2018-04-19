const nodemailer = require("nodemailer");
const xoauth2 = require("xoauth2");
const keys = require('../config/keys');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'AndriyKuf@gmail.com',
//         clientId: keys.google.clientID,
//         clientSecret: keys.google.clientSecret,
//         refreshToken: keys.google.refreshToken,
//         accessToken: 'ya29.GluhBfaIZHFB1wYulB8MKlJeY9rifv5yGuQbRYYdiTaa536gfogSZKQz1aaTEccORslAAyvwv9Cu63RIph1Nn4C8BTCTEd9j6XVVVIMx2W3NBsQ75hERF2znFyEN',
//         expires: 1494314697598
//     }
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: keys.mail.name,
        pass: keys.mail.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

// const mailOptions = {
//   from: "AndriyKuf@gmail.com",
//   to: 'dronozzavr@gmail.com',
//   subject: 'Nodemailer test',
//   text: "Hello this is my test nodemailer message"
// };
//
// transporter.sendMail(mailOptions, (err, result) => {
//     if (err) {
//         console.log(err);
//         // res.end(err);
//     } else {
//         console.log('Mail sent.log');
//         // res.end('Good');
//     }
// });

module.exports = transporter;
