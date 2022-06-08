const express = require('express')
const router = express.Router()
const utils = require('../utils')
const User = require("../models/user")


router.get('/', utils.checkAuthenticated, async (req, res) => {
    try {
        let top10 = await User.find({}).sort({points: -1, username: 1}).limit(10)
        res.render('ranking/ranking', {
            users: top10,
            user: req.user
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router