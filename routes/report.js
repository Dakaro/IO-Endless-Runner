const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')
require('dotenv').config()

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_ACCOUNT_PASSWORD
    }
});

router.get('/', authCheck.checkAuthenticated, (req, res) => {
    res.render('report/report', {user: req.user, email: process.env.EMAIL_ADDRESS})
})

router.post('/', authCheck.checkAuthenticated, async (req, res) =>{
    let mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: process.env.EMAIL_ADDRESS,
        subject: "Error report from IOproject game",
        text: req.body.errorReport
    }
    try{
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                console.log(err);
                return;
            }
            console.log("Sent: " + info.response);
        })
        res.render('report/reportSent', {user: req.user})
    } catch {
        res.render('report/reportSentErr', {user: req.user})
    }
})

module.exports = router