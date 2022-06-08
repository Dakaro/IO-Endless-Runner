const express = require('express')
const router = express.Router()
const utils = require('../utils')
const User = require("../models/user")

router.post('/:coins/:distance', utils.checkAuthenticated, async (req, res) => {
    try {
        let user = await User.findById(req.user._id)
        user.coins += parseInt(req.params.coins)
        if(req.params.distance > user.points) user.points = req.params.distance
        
        const userSaved = await user.save()   
        
        res.send({points: user.coins})
    } catch {
        res.redirect('/')
    }
})

router.get('/', utils.checkAuthenticated, async (req, res) => { 
    res.sendFile(__dirname, '..', 'public', 'scripts', 'embed.html')
})

module.exports = router