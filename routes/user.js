const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/:username', async (req, res) => {
    try {
        const user = await User.find({username: req.params.username})
        res.render('user/user', { user: user })
    } catch {
        res.redirect('/')
    }
})

module.exports = router