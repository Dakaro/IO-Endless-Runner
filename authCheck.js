const express = require('express')
const router = express.Router()

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/auth')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/')
    next()
}

module.exports.checkAuthenticated = checkAuthenticated
module.exports.checkNotAuthenticated = checkNotAuthenticated