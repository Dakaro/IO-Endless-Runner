const express = require('express')
const router = express.Router()
const User = require('../models/user')
const authCheck = require('../authCheck')
const bcrypt = require('bcrypt')

router.get('/', authCheck.checkNotAuthenticated, (req, res) => {
    res.render('auth/login')
})

router.get('/register', authCheck.checkNotAuthenticated, (req, res) => {
    res.render('auth/register')
})

router.post('/register', authCheck.checkNotAuthenticated, async (req, res) => {   
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

router.delete('/logout', authCheck.checkAuthenticated, (req, res) => {
    req.logOut((err) => {
        if(err) return next(err)
        res.redirect('/auth')
    })
})

module.exports = router