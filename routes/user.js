const express = require('express')
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')
const prices = require('../public/avis/prices')

router.get('/', utils.checkAuthenticated, async (req, res) => {
    res.render(`user/user`, { user: req.user, userToDisplay: null })
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.render('user/user', {
            userToDisplay: user,
            user: req.user
        })
    } catch {
        res.redirect('/')
    }
})

router.post('/avi/:id', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (req.params.id <= Object.keys(prices).length && req.params.id >= 0) {
            user.equippedSkin = req.params.id
            const savedUser = await user.save()
            res.render('user/user', {
                userToDisplay: null,
                user: savedUser
            })
        }
        else{
            res.render('user/user', {
                userToDisplay: null,
                user: req.user
            })
        }
    } catch {
        res.redirect('/')
    }
})

module.exports = router