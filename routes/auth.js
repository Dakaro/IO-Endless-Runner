const express = require('express')
const router = express.Router()
const User = require('../models/user')
const authCheck = require('../authCheck')

router.get('/', authCheck.checkNotAuthenticated, (req, res) => {
    res.render('auth/login')
})

router.get('/register', authCheck.checkNotAuthenticated, (req, res) => {
    res.render('auth/register', {
        errorMessage: null
    })
})

router.post('/register', authCheck.checkNotAuthenticated, async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    
    try {
        const newUser = await user.save()
        console.log(newUser)
        res.redirect('/')
    } catch {
        res.render('auth/register', {
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