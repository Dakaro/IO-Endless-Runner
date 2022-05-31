const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')
const User = require("../models/user")


router.get('/', authCheck.checkAuthenticated, async (req, res) => {
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