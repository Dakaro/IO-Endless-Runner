const express = require('express')
const router = express.Router()
const User = require('../models/user')
<<<<<<< HEAD
const authCheck = require('../authCheck')
const bcrypt = require('bcrypt')
=======
const utils = require('../utils')
>>>>>>> fa60aa09bbe4a953bf11b2df38d01c3a595e5858

router.get('/', utils.checkNotAuthenticated, (req, res) => {
    res.render('auth/login')
})

router.get('/register', utils.checkNotAuthenticated, (req, res) => {
    res.render('auth/register', {
        errorMessage: null
    })
})

<<<<<<< HEAD
router.post('/register', authCheck.checkNotAuthenticated, async (req, res) => {   
=======
router.post('/register', utils.checkNotAuthenticated, async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    
>>>>>>> fa60aa09bbe4a953bf11b2df38d01c3a595e5858
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
<<<<<<< HEAD
        res.render('auth', {
            user: {
                username: req.body.username,
                password: hashpassword  //req.body.password
            },
=======
        res.render('auth/register', {
>>>>>>> fa60aa09bbe4a953bf11b2df38d01c3a595e5858
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