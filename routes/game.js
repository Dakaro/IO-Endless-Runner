const express = require('express')
const router = express.Router()
const authCheck = require('../authCheck')
const User = require("../models/user")

router.post('/:coins/:distance', authCheck.checkAuthenticated, async (req, res) => {
    try {
        let user = await User.findById(req.user._id)
        user.coins += parseInt(req.params.coins)
        user.points += parseInt(req.params.distance)
        
        const userSaved = await user.save()        
        
        res.render('index', {
            user: userSaved
        })
    } catch {
        res.redirect('/')
    }
})

module.exports = router