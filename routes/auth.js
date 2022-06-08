const express = require('express')
const router = express.Router()
const User = require('../models/user')
const utils = require('../utils')
const bcrypt = require('bcrypt')

router.get('/', utils.checkNotAuthenticated, (req, res) => {
    res.render('auth/login')
})

router.get('/register', utils.checkNotAuthenticated, (req, res) => {
    res.render('auth/register', {
        errorMessage: null
    })
})

router.post('/register', utils.checkNotAuthenticated, async (req, res) => {   
    try {
        const hashpassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            username: req.body.username,
            password: hashpassword
        })
        const newUser = await user.save()
        console.log(newUser)
        res.redirect('/')
    } catch {
        res.render('auth', {
            user: {
                username: req.body.username,
                password: hashpassword  //req.body.password
            },
            errorMessage: 'Error registering new user'
        })
    }
})

router.delete('/logout', utils.checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if(err) return next(err)
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.redirect('/auth')
    })
})

module.exports = router