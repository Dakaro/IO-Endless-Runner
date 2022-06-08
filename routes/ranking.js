const express = require('express')
const router = express.Router()
const utils = require('../utils')
const User = require("../models/user")


router.get('/', utils.checkAuthenticated, async (req, res) => {
    let topCoins
    let topPoints
    try {
        topPoints = await User.find().sort({points: 'desc' , username: 'asc' }).limit(10).exec()
        topCoins = await User.find().sort({coins: -1, username: 1}).limit(10).exec()
        
        res.render('ranking/ranking', {
            topCoins: topCoins,
            topPoints: topPoints,
            user: req.user
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router