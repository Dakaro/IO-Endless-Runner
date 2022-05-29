const express = require('express')
const passport = require('passport')
const router = express.Router()
const authCheck = require('../authCheck')


router.get('/', authCheck.checkAuthenticated, (req, res) => {
    res.render('index', {user: req.user})
})

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
}))



module.exports = router