const express = require('express');
const router = express.Router();
const path = require('path');

const transporter = require('../nodemailer/transporter');

/* GET home page. */
router.post('/order', function(req, res) {
    transporter.sendMail(getMailOptions(req.body || {}), (err, result) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            console.log(req.body);
            res.end('good');
        }
    })
});

function getMailOptions(dto = {}) {
    return {
        from: 'AndriyKuf@gmail.com',
        to: 'dronozzavr@gmail.com',
        subject: 'Nodemailer test',
        text: `Name: ${dto.name || 'empty'}; E-mail: ${dto.mail || 'empty'}; Phone: ${dto.phone || 'empty'}; Message: ${dto.msg || 'empty'}`
    }
}

module.exports = router;
