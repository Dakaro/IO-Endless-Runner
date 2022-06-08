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

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

module.exports.checkAuthenticated = checkAuthenticated
module.exports.checkNotAuthenticated = checkNotAuthenticated
module.exports.nocache = nocache