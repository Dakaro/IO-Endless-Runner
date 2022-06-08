const express = require('express')
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')
const prices = require('../public/avis/prices')

router.get('/', utils.checkAuthenticated, async (req, res) => {
    res.render('shop/shop', { user: req.user, prices: prices})
})

router.post('/:id', utils.checkAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user)
        user.coins -= prices[req.params.id]
        user.unlockedSkins.push(req.params.id)
        
        const savedUser = await user.save()
        res.render('shop/shop', {
            user: savedUser,
            prices: prices
        })
    } catch {
        res.redirect('shop/shop')
    }
})

module.exports = router