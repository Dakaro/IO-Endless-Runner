const express = require('express')
const passport = require('passport')
const router = express.Router()
const authCheck = require('../authCheck')
const User = require("../models/user")
// const testFunctions = require("/public/scripts/gameServerHandler.js")

router.get('/get', (req, res) => {
    res.send('this works here too')
})

router.get('/', authCheck.checkAuthenticated, (req, res) => {
    res.render('index', {user: req.user})
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}), async (req, res) => {
    try {
        let user = await User.findById(res.user._id)
        user.lastSeen = Date.now()
        let userSaved = await user.save()
        res.render('index', {
            user: userSaved
        })
    } catch{
        res.redirect('/auth')
    }
    
})

module.exports = router